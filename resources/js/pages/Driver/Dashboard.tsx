import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Truck, MapPin, CheckCircle, Navigation } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';

interface Shipment {
    id: number;
    tracking_number: string;
    status: string;
    origin_city: string;
    destination_city: string;
    customer: { name: string };
}

interface Props {
    activeShipments: Shipment[];
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
            alert('Geolocation is not supported by your browser.');
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
            setWatchId(null);
        }
        setTracking(false);
    };

    useEffect(() => {
        return () => {
            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
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
                                    ? 'Your location is being shared with dispatch'
                                    : 'Start tracking to share your location'}
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
                        {tracking ? 'Stop Tracking' : 'Start Tracking'}
                    </button>
                </div>

                {/* Active shipment selector */}
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

            {/* Assigned shipments */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-slate-150 border-b bg-slate-50/20 p-5">
                    <h3 className="text-sm font-bold text-slate-800">
                        My Shipments
                    </h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {activeShipments.length === 0 && (
                        <p className="py-8 text-center text-xs text-slate-400">
                            No shipments assigned.
                        </p>
                    )}
                    {activeShipments.map((s) => (
                        <div
                            key={s.id}
                            onClick={() =>
                                router.visit(`/shipments/${s.tracking_number}`)
                            }
                            className="flex cursor-pointer items-center justify-between p-4 hover:bg-slate-50"
                        >
                            <div>
                                <p className="font-mono text-xs font-bold text-indigo-600">
                                    {s.tracking_number}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    {s.origin_city} → {s.destination_city}
                                </p>
                                <p className="mt-0.5 text-[10px] text-slate-400">
                                    {s.customer.name}
                                </p>
                            </div>
                            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700">
                                {s.status.replace('_', ' ')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
