import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState, lazy, Suspense } from 'react';
import echo from '@/echo';
import {
    ArrowLeft,
    Clock,
    Scale,
    ShieldAlert,
    Truck,
    Phone,
    ExternalLink,
    Map,
    Trash2,
    Pencil,
} from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { toast } from 'sonner';
import EditShipmentModal from '@/components/EditShipmentModal';

const ShipmentMap = lazy(() => import('@/components/ShipmentMap'));

interface StatusLog {
    id: number;
    from_status: string | null;
    to_status: string;
    note: string | null;
    lat: number | null;
    lng: number | null;
    created_at: string;
    user: { name: string; role: string };
}

interface Shipment {
    id: number;
    tracking_number: string;
    status: string;
    origin_address: string;
    origin_city: string;
    origin_country: string;
    origin_lat: number | null;
    origin_lng: number | null;
    destination_address: string;
    destination_city: string;
    destination_country: string;
    destination_lat: number | null;
    destination_lng: number | null;
    description: string | null;
    weight: number | null;
    price: number | null;
    estimated_delivery: string | null;
    delivered_at: string | null;
    customer: { id: number; name: string; email: string; phone: string | null };
    driver: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
    } | null;
    company: { name: string };
    status_logs: StatusLog[];
    latest_driver_location: {
        lat: number;
        lng: number;
        recorded_at: string;
    } | null;
}

interface Props {
    shipment: Shipment;
    allowedTransitions: string[];
}

const statusColors: Record<string, string> = {
    pending: 'bg-slate-50 text-slate-600 border-slate-200',
    assigned: 'bg-blue-50 text-blue-700 border-blue-200',
    picked_up: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    in_transit: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    out_for_delivery: 'bg-orange-50 text-orange-700 border-orange-200',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    failed: 'bg-red-50 text-red-600 border-red-200',
    cancelled: 'bg-slate-50 text-slate-500 border-slate-200',
};

const logColor: Record<string, string> = {
    delivered: 'bg-emerald-600 text-white border-emerald-600',
    failed: 'bg-red-500 text-white border-red-500',
    cancelled: 'bg-slate-400 text-white border-slate-400',
    picked_up: 'bg-indigo-600 text-white border-indigo-600',
    in_transit: 'bg-indigo-600 text-white border-indigo-600',
    out_for_delivery: 'bg-orange-500 text-white border-orange-500',
    assigned: 'bg-blue-500 text-white border-blue-500',
    pending: 'bg-slate-200 text-slate-600 border-slate-200',
};

export default function Show({ shipment, allowedTransitions }: Props) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [liveStatus, setLiveStatus] = useState(shipment.status);
    const [liveLogs, setLiveLogs] = useState(shipment.status_logs);
    const [liveDriverLocation, setLiveDriverLocation] = useState(
        shipment.latest_driver_location,
    );
    const [activeTab, setActiveTab] = useState<'timeline' | 'specs' | 'driver'>(
        'timeline',
    );

    const { data, setData, post, processing } = useForm({
        status: '',
        note: '',
    });

    const { auth, modal_data } = usePage<{
        auth: { user: { role: string } };
        modal_data: { drivers: { id: number; name: string }[] } | null;
    }>().props;

    const drivers = modal_data?.drivers ?? [];

    const submitTransition = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/shipments/${shipment.tracking_number}/transition`, {
            onSuccess: () => setData({ status: '', note: '' }),
        });
    };

    const copyTrackerLink = () => {
        navigator.clipboard.writeText(
            `${window.location.origin}/track/${shipment.tracking_number}`,
        );
    };

    useEffect(() => {
        const channel = echo.private(`shipment.${shipment.id}`);

        channel.listen('.status.updated', (e: any) => {
            setLiveStatus(e.status);
            setLiveLogs((prev) => [e.log, ...prev]);
        });

        channel.listen('.location.updated', (e: any) => {
            setLiveDriverLocation({
                lat: e.lat,
                lng: e.lng,
                recorded_at: e.recorded_at,
            });
        });

        return () => {
            echo.leave(`shipment.${shipment.id}`);
        };
    }, [shipment.id]);

    return (
        <div className="space-y-6">
            {/* Nav bar */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200/60 bg-slate-100/50 p-2 sm:flex-row sm:items-center">
                <button
                    onClick={() => router.visit('/shipments')}
                    className="group flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-white hover:text-slate-950 hover:shadow-sm"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    <span>Back to Shipments</span>
                </button>

                <div className="flex items-center gap-2.5 px-3">
                    <span className="font-mono text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                        Dispatch Log
                    </span>
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    <span className="rounded-xl border border-slate-200 bg-white px-3 py-1 font-mono text-xs font-bold text-slate-900">
                        {shipment.tracking_number}
                    </span>

                    {['super_admin', 'company_admin'].includes(
                        auth.user.role,
                    ) && (
                        <>
                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-100"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={() => {
                                    toast('Delete this shipment?', {
                                        description: `${shipment.tracking_number} will be permanently removed.`,
                                        action: {
                                            label: 'Delete',
                                            onClick: () =>
                                                router.delete(
                                                    `/shipments/${shipment.tracking_number}`,
                                                    {
                                                        onSuccess: () =>
                                                            router.visit(
                                                                '/shipments',
                                                            ),
                                                    },
                                                ),
                                        },
                                        cancel: {
                                            label: 'Cancel',
                                            onClick: () => {},
                                        },
                                        duration: 10000,
                                    });
                                }}
                                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 px-3 py-1 text-xs font-semibold text-red-500 transition-all hover:border-red-500 hover:bg-red-500 hover:text-white"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Edit modal — outside nav bar */}
            {isEditOpen && (
                <EditShipmentModal
                    shipment={shipment}
                    onClose={() => setIsEditOpen(false)}
                    drivers={drivers}
                />
            )}

            {/* Body */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                {/* Left: Map */}
                <div className="flex h-[520px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:col-span-5">
                    <div className="border-slate-150 flex items-center justify-between border-b bg-slate-50/20 p-5 text-xs">
                        <div className="flex items-center gap-2 font-semibold text-slate-800">
                            <Map className="h-4 w-4 text-slate-400" />
                            <span>Real-Time Route Telemetry</span>
                        </div>
                        <span className="border-indigo-150 rounded-lg border bg-indigo-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-indigo-600">
                            {liveStatus === 'in_transit' ||
                            liveStatus === 'out_for_delivery'
                                ? 'GPS active'
                                : 'GPS inactive'}
                        </span>
                    </div>

                    {shipment.origin_lat && shipment.destination_lat ? (
                        <Suspense
                            fallback={
                                <div className="flex flex-1 items-center justify-center bg-slate-950">
                                    <p className="font-mono text-xs text-slate-400">
                                        Loading map...
                                    </p>
                                </div>
                            }
                        >
                            <div className="relative h-full flex-1">
                                <ShipmentMap
                                    originLat={shipment.origin_lat}
                                    originLng={shipment.origin_lng!}
                                    originCity={shipment.origin_city}
                                    destinationLat={shipment.destination_lat}
                                    destinationLng={shipment.destination_lng!}
                                    destinationCity={shipment.destination_city}
                                    driverLocation={liveDriverLocation}
                                    status={liveStatus}
                                />
                                {/* HUD footer */}
                                <div className="absolute right-3 bottom-3 left-3 z-[1000] flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/85 p-2.5 font-mono text-[10px] text-slate-400 backdrop-blur-md">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                liveStatus === 'in_transit'
                                                    ? 'animate-pulse bg-emerald-500'
                                                    : 'bg-slate-600'
                                            }`}
                                        />
                                        <span>
                                            {liveDriverLocation
                                                ? `LAT: ${liveDriverLocation.lat.toFixed(4)} // LON: ${liveDriverLocation.lng.toFixed(4)}`
                                                : shipment.origin_lat
                                                  ? `LAT: ${shipment.origin_lat} // LON: ${shipment.origin_lng}`
                                                  : 'Coordinates unavailable'}
                                        </span>
                                    </div>
                                    <span>
                                        {liveStatus
                                            .replace('_', ' ')
                                            .toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </Suspense>
                    ) : (
                        <div className="flex flex-1 items-center justify-center bg-slate-950">
                            <p className="font-mono text-xs text-slate-400">
                                No coordinates available
                            </p>
                        </div>
                    )}
                </div>

                {/* Right: Details panel */}
                <div className="flex min-h-[520px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:col-span-7">
                    {/* Header */}
                    <div className="border-slate-150 border-b p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <span className="block font-mono text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                                    {shipment.customer.name}
                                </span>
                                <h3 className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
                                    {shipment.origin_city} to{' '}
                                    {shipment.destination_city}
                                </h3>
                                {shipment.estimated_delivery && (
                                    <div className="mt-2 flex max-w-max items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 p-1.5 px-2.5 text-xs text-slate-500">
                                        <Clock className="h-3.5 w-3.5 shrink-0 text-indigo-600" />
                                        <span>
                                            ETA:{' '}
                                            <strong className="text-slate-900">
                                                {new Date(
                                                    shipment.estimated_delivery,
                                                ).toLocaleDateString()}
                                            </strong>
                                        </span>
                                    </div>
                                )}
                            </div>
                            <span
                                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusColors[liveStatus] ?? ''}`}
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                {liveStatus.replace('_', ' ')}
                            </span>
                        </div>

                        {/* Status transition */}
                        {allowedTransitions.length > 0 && (
                            <form
                                onSubmit={submitTransition}
                                className="mt-4 flex items-end gap-2"
                            >
                                <div className="flex-1">
                                    <select
                                        value={data.status}
                                        onChange={(e) =>
                                            setData('status', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                                    >
                                        <option value="">
                                            Update status...
                                        </option>
                                        {allowedTransitions.map((s) => (
                                            <option key={s} value={s}>
                                                {s.replace('_', ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Note (optional)"
                                        value={data.note}
                                        onChange={(e) =>
                                            setData('note', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing || !data.status}
                                    className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Update
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="border-slate-150 flex gap-5 border-b bg-slate-50/20 px-5 text-xs">
                        {(['timeline', 'specs', 'driver'] as const).map(
                            (tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`cursor-pointer border-b-2 py-3.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                                        activeTab === tab
                                            ? 'border-indigo-600 text-indigo-700'
                                            : 'border-transparent text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    {tab === 'timeline'
                                        ? 'Timeline Journal'
                                        : tab === 'specs'
                                          ? 'Specifications'
                                          : 'Fleet Asset'}
                                </button>
                            ),
                        )}
                    </div>

                    {/* Tab content */}
                    <div className="flex flex-1 flex-col justify-between p-5">
                        <div className="space-y-4">
                            {/* Timeline */}
                            {activeTab === 'timeline' && (
                                <div className="space-y-4">
                                    {liveLogs.length === 0 && (
                                        <p className="py-8 text-center text-xs text-slate-400">
                                            No status updates yet.
                                        </p>
                                    )}
                                    {liveLogs.map((log, idx) => (
                                        <div
                                            key={log.id}
                                            className="relative flex gap-4"
                                        >
                                            {idx !== liveLogs.length - 1 && (
                                                <div className="absolute top-6 bottom-[-20px] left-[13px] w-px bg-slate-200" />
                                            )}
                                            <div
                                                className={`z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${logColor[log.to_status] ?? 'border-slate-200 bg-white text-slate-400'}`}
                                            >
                                                ✓
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-baseline gap-2.5">
                                                    <h4 className="text-xs font-bold text-slate-900 capitalize">
                                                        {log.to_status.replace(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </h4>
                                                    <span className="font-mono text-[10px] text-slate-400">
                                                        {new Date(
                                                            log.created_at,
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                                {log.note && (
                                                    <p className="text-xs leading-relaxed text-slate-500">
                                                        {log.note}
                                                    </p>
                                                )}
                                                <p className="font-mono text-[10px] text-slate-400">
                                                    by {log.user?.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Specs */}
                            {activeTab === 'specs' && (
                                <div className="space-y-4 text-xs">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                            <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                                                Gross Weight
                                            </p>
                                            <div className="mt-1 flex items-center gap-2">
                                                <Scale className="h-4 w-4 text-slate-400" />
                                                <span className="font-mono text-sm font-bold text-slate-900">
                                                    {shipment.weight
                                                        ? `${shipment.weight} kg`
                                                        : '—'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                            <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                                                Fulfillment Cost
                                            </p>
                                            <span className="mt-0.5 block font-mono text-lg font-bold text-emerald-700">
                                                {shipment.price
                                                    ? `€${Number(shipment.price).toLocaleString()}`
                                                    : '—'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                            <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                                                Origin
                                            </p>
                                            <p className="mt-1 font-semibold text-slate-900">
                                                {shipment.origin_address}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {shipment.origin_city},{' '}
                                                {shipment.origin_country}
                                            </p>
                                        </div>
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                            <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                                                Destination
                                            </p>
                                            <p className="mt-1 font-semibold text-slate-900">
                                                {shipment.destination_address}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {shipment.destination_city},{' '}
                                                {shipment.destination_country}
                                            </p>
                                        </div>
                                    </div>
                                    {shipment.description && (
                                        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5">
                                            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                            <div>
                                                <strong className="block font-mono text-[10px] font-bold tracking-wider text-amber-800 uppercase">
                                                    Description
                                                </strong>
                                                <p className="mt-1 text-xs font-medium text-slate-800">
                                                    {shipment.description}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Driver */}
                            {activeTab === 'driver' && (
                                <div className="space-y-4">
                                    {!shipment.driver ? (
                                        <div className="py-8 text-center text-xs text-slate-400">
                                            No driver assigned yet.
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-indigo-100">
                                                    <img
                                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(shipment.driver.name)}`}
                                                        alt={
                                                            shipment.driver.name
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-mono text-xs font-bold text-slate-400 uppercase">
                                                        Assigned Driver
                                                    </p>
                                                    <h4 className="mt-0.5 text-base font-bold text-slate-900">
                                                        {shipment.driver.name}
                                                    </h4>
                                                    <p className="mt-1 flex items-center gap-1 font-mono text-xs text-slate-500">
                                                        <Truck className="h-3.5 w-3.5 text-slate-400" />
                                                        <span>
                                                            {
                                                                shipment.driver
                                                                    .email
                                                            }
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            {shipment.driver.phone && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <a
                                                        href={`tel:${shipment.driver.phone}`}
                                                        className="flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white p-3 text-center transition-all hover:bg-slate-50"
                                                    >
                                                        <Phone className="h-4 w-4 text-slate-500" />
                                                        <span className="mt-1 font-mono text-xs font-bold text-slate-900">
                                                            {
                                                                shipment.driver
                                                                    .phone
                                                            }
                                                        </span>
                                                        <span className="font-mono text-[9px] font-bold text-slate-400 uppercase">
                                                            Quick Dial
                                                        </span>
                                                    </a>
                                                    <button className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white p-3 text-center transition-all hover:bg-slate-50">
                                                        <ExternalLink className="h-4 w-4 text-slate-500" />
                                                        <span className="mt-1 text-xs font-bold text-slate-900">
                                                            View Profile
                                                        </span>
                                                        <span className="font-mono text-[9px] font-bold text-slate-400 uppercase">
                                                            Driver Details
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Share tracker */}
                        <div className="border-slate-150 border-t pt-4">
                            <div className="border-indigo-150 flex flex-col items-center justify-between gap-3 rounded-2xl border bg-indigo-50 p-3 text-xs sm:flex-row">
                                <span className="font-medium text-indigo-700">
                                    Share live tracking with the customer?
                                </span>
                                <button
                                    onClick={copyTrackerLink}
                                    className="cursor-pointer rounded-xl border border-indigo-200 bg-white px-3.5 py-1.5 text-[10px] font-bold text-indigo-600 transition-colors hover:bg-indigo-50"
                                >
                                    Copy Secure Tracker Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Show.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
