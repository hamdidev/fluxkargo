import { Clock, CheckCircle, Truck, Package } from 'lucide-react';
import { lazy, Suspense } from 'react';

const ShipmentMap = lazy(() => import('@/components/ShipmentMap'));

interface Props {
    shipment: {
        tracking_number: string;
        status: string;
        origin_city: string;
        origin_country: string;
        origin_lat: number | null;
        origin_lng: number | null;
        destination_city: string;
        destination_country: string;
        destination_lat: number | null;
        destination_lng: number | null;
        estimated_delivery: string | null;
        delivered_at: string | null;
        company: string;
        current_status_log: {
            to_status: string;
            note: string | null;
            created_at: string;
        } | null;
    };
    latest_driver_location: {
        lat: number;
        lng: number;
        recorded_at: string;
    } | null;
}

const statusColors: Record<string, string> = {
    pending: 'bg-slate-100 text-slate-600',
    assigned: 'bg-blue-100 text-blue-700',
    picked_up: 'bg-indigo-100 text-indigo-700',
    in_transit: 'bg-indigo-100 text-indigo-700',
    out_for_delivery: 'bg-orange-100 text-orange-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-red-100 text-red-600',
    cancelled: 'bg-slate-100 text-slate-500',
};

export default function Show({ shipment, latest_driver_location }: Props) {
    const isDelivered = shipment.status === 'delivered';

    return (
        <div className="min-h-screen bg-[#f8f9ff]">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-4xl items-center gap-3 px-6 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
                        <div className="h-4 w-4 rotate-45 transform rounded-sm bg-white" />
                    </div>
                    <div>
                        <h1 className="leading-none font-bold text-slate-900">
                            FluxKargo
                        </h1>
                        <p className="text-[10px] tracking-wider text-slate-400 uppercase">
                            Shipment Tracker
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
                {/* Status card */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="font-mono text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                {shipment.company}
                            </p>
                            <h2 className="mt-1 font-mono text-2xl font-bold text-slate-900">
                                {shipment.tracking_number}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {shipment.origin_city},{' '}
                                {shipment.origin_country} →{' '}
                                {shipment.destination_city},{' '}
                                {shipment.destination_country}
                            </p>
                        </div>
                        <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusColors[shipment.status] ?? ''}`}
                        >
                            {shipment.status.replace('_', ' ')}
                        </span>
                    </div>

                    {/* ETA / Delivered */}
                    <div className="mt-4 flex items-center gap-2 text-sm">
                        {isDelivered ? (
                            <div className="flex items-center gap-2 text-emerald-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="font-semibold">
                                    Delivered{' '}
                                    {shipment.delivered_at
                                        ? new Date(
                                              shipment.delivered_at,
                                          ).toLocaleDateString()
                                        : ''}
                                </span>
                            </div>
                        ) : shipment.estimated_delivery ? (
                            <div className="flex items-center gap-2 text-slate-600">
                                <Clock className="h-4 w-4" />
                                <span>
                                    Estimated delivery:{' '}
                                    <strong>
                                        {new Date(
                                            shipment.estimated_delivery,
                                        ).toLocaleDateString()}
                                    </strong>
                                </span>
                            </div>
                        ) : null}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-5">
                        {(() => {
                            const steps = [
                                'pending',
                                'assigned',
                                'picked_up',
                                'in_transit',
                                'out_for_delivery',
                                'delivered',
                            ];
                            const currentIdx = steps.indexOf(shipment.status);

                            return (
                                <div className="flex items-center gap-1">
                                    {steps.map((step, i) => (
                                        <div
                                            key={step}
                                            className="flex flex-1 items-center"
                                        >
                                            <div
                                                className={`h-2 w-full rounded-full ${
                                                    i <= currentIdx
                                                        ? 'bg-indigo-600'
                                                        : 'bg-slate-200'
                                                }`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}
                        <div className="mt-1 flex justify-between font-mono text-[9px] text-slate-400 uppercase">
                            <span>Pending</span>
                            <span>Picked up</span>
                            <span>In Transit</span>
                            <span>Delivered</span>
                        </div>
                    </div>
                </div>

                {/* Current Status */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-sm font-bold text-slate-900">
                        Current Status
                    </h3>
                    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div
                            className={`rounded-2xl p-3 ${
                                shipment.status === 'delivered'
                                    ? 'bg-emerald-100'
                                    : shipment.status === 'in_transit'
                                      ? 'bg-indigo-100'
                                      : shipment.status === 'out_for_delivery'
                                        ? 'bg-orange-100'
                                        : shipment.status === 'failed'
                                          ? 'bg-red-100'
                                          : 'bg-slate-100'
                            }`}
                        >
                            {shipment.status === 'delivered' ? (
                                <CheckCircle className="h-5 w-5 text-emerald-600" />
                            ) : shipment.status === 'in_transit' ||
                              shipment.status === 'out_for_delivery' ? (
                                <Truck className="h-5 w-5 text-indigo-600" />
                            ) : (
                                <Package className="h-5 w-5 text-slate-500" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 capitalize">
                                {shipment.status.replace(/_/g, ' ')}
                            </p>
                            {shipment.current_status_log?.note && (
                                <p className="mt-0.5 text-xs text-slate-500">
                                    {shipment.current_status_log.note}
                                </p>
                            )}
                            {shipment.current_status_log?.created_at && (
                                <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                                    {new Date(
                                        shipment.current_status_log.created_at,
                                    ).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Map */}
                {shipment.origin_lat && shipment.destination_lat && (
                    <div className="h-[300px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <Suspense
                            fallback={
                                <div className="flex h-full items-center justify-center bg-slate-50">
                                    <p className="text-xs text-slate-400">
                                        Loading map...
                                    </p>
                                </div>
                            }
                        >
                            <ShipmentMap
                                originLat={shipment.origin_lat}
                                originLng={shipment.origin_lng!}
                                originCity={shipment.origin_city}
                                destinationLat={shipment.destination_lat}
                                destinationLng={shipment.destination_lng!}
                                destinationCity={shipment.destination_city}
                                driverLocation={latest_driver_location}
                                status={shipment.status}
                            />
                        </Suspense>
                    </div>
                )}

                {/* Footer */}
                <p className="pb-4 text-center text-[10px] text-slate-400">
                    Powered by FluxKargo · Real-time logistics tracking
                </p>
            </div>
        </div>
    );
}

// No layout — public page
Show.layout = null;
