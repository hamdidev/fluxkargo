import { router, usePage, useForm } from '@inertiajs/react';
import { Navigation, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/AppLayout';

interface Shipment {
    id: number;
    tracking_number: string;
    status: string;
    origin_city: string;
    destination_city: string;
    customer: { name: string };
    allowed_transitions: string[];
}

interface Props {
    activeShipments: Shipment[];
}

function ShipmentCard({ shipment }: { shipment: Shipment }) {
    const [showUpdate, setShowUpdate] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        status: '',
        note: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/shipments/${shipment.tracking_number}/transition`, {
            onSuccess: () => {
                reset();
                setShowUpdate(false);
            },
        });
    };

    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* Shipment info */}
            <div className="flex items-center justify-between p-5">
                <div>
                    <p className="font-mono text-xs font-bold text-indigo-600">
                        {shipment.tracking_number}
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                        {shipment.origin_city} → {shipment.destination_city}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                        {shipment.customer.name}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                            shipment.status === 'delivered'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : shipment.status === 'in_transit'
                                  ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                                  : shipment.status === 'out_for_delivery'
                                    ? 'border-orange-200 bg-orange-50 text-orange-700'
                                    : 'border-slate-200 bg-slate-50 text-slate-600'
                        }`}
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {shipment.status.replace('_', ' ')}
                    </span>
                    <button
                        onClick={() =>
                            router.visit(
                                `/shipments/${shipment.tracking_number}`,
                            )
                        }
                        className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-slate-50"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Quick update */}
            {shipment.allowed_transitions.length > 0 && (
                <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">
                    {!showUpdate ? (
                        <button
                            onClick={() => setShowUpdate(true)}
                            className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white transition-all hover:bg-indigo-700"
                        >
                            Update Status
                        </button>
                    ) : (
                        <form onSubmit={submit} className="space-y-2">
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                                required
                            >
                                <option value="">Select new status...</option>
                                {shipment.allowed_transitions.map((s) => (
                                    <option key={s} value={s}>
                                        {s.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Note (optional)"
                                value={data.note}
                                onChange={(e) =>
                                    setData('note', e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowUpdate(false);
                                        reset();
                                    }}
                                    className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || !data.status}
                                    className="flex-1 rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                                >
                                    {processing ? 'Updating...' : 'Confirm'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default function Dashboard({ activeShipments }: Props) {
    const { auth } = usePage<{ auth: { user: { name: string } } }>().props;
    const [tracking, setTracking] = useState(false);
    const [watchId, setWatchId] = useState<number | null>(null);
    const [currentShipmentId, setCurrentShipmentId] = useState<number | null>(
        activeShipments[0]?.id ?? null,
    );

    const startTracking = () => {
        if (!navigator.geolocation) {
            return;
        }

        const id = navigator.geolocation.watchPosition(
            (position) => {
                router.post(
                    '/driver/location',
                    {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        speed: position.coords.speed,
                        heading: position.coords.heading,
                        shipment_id: currentShipmentId,
                    },
                    { preserveState: true },
                );
            },
            (error) => console.error('GPS error:', error),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 },
        );
        setWatchId(id);
        setTracking(true);
    };

    const stopTracking = () => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
        }

        setWatchId(null);
        setTracking(false);
    };

    useEffect(() => {
        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [watchId]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Driver Dashboard
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                    Welcome back, {auth.user.name}
                </p>
            </div>

            {/* GPS Tracking Card */}
            <div
                className={`rounded-3xl border p-6 shadow-sm transition-all ${
                    tracking
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-slate-200 bg-white'
                }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={`rounded-2xl p-3 ${tracking ? 'bg-emerald-100' : 'bg-slate-100'}`}
                        >
                            <Navigation
                                className={`h-5 w-5 ${tracking ? 'animate-pulse text-emerald-600' : 'text-slate-400'}`}
                            />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">
                                {tracking
                                    ? 'GPS Tracking Active'
                                    : 'GPS Tracking Off'}
                            </h3>
                            <p className="mt-0.5 text-xs text-slate-500">
                                {tracking
                                    ? 'Your location is being shared'
                                    : 'Start tracking to share location'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={tracking ? stopTracking : startTracking}
                        className={`cursor-pointer rounded-xl px-5 py-2.5 text-xs font-semibold transition-all ${
                            tracking
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-slate-900 text-white hover:bg-indigo-600'
                        }`}
                    >
                        {tracking ? 'Stop' : 'Start Tracking'}
                    </button>
                </div>

                {activeShipments.length > 0 && (
                    <div className="mt-4">
                        <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                            Active Shipment
                        </label>
                        <select
                            value={currentShipmentId ?? ''}
                            onChange={(e) =>
                                setCurrentShipmentId(Number(e.target.value))
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                        >
                            {activeShipments.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.tracking_number} — {s.origin_city} →{' '}
                                    {s.destination_city}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Shipment cards */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800">
                    My Shipments
                </h3>
                {activeShipments.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
                        No shipments assigned.
                    </div>
                ) : (
                    activeShipments.map((s) => (
                        <ShipmentCard key={s.id} shipment={s} />
                    ))
                )}
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
