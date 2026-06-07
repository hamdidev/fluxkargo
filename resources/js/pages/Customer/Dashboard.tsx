import { router } from '@inertiajs/react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';

interface Shipment {
    id: number;
    tracking_number: string;
    status: string;
    origin_city: string;
    destination_city: string;
    estimated_delivery: string | null;
    created_at: string;
}

interface Props {
    shipments: Shipment[];
    stats: {
        total: number;
        in_transit: number;
        delivered: number;
        pending: number;
    };
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

export default function Dashboard({ shipments, stats }: Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    My Shipments
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                    Track and monitor your shipments.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                    {
                        label: 'Total',
                        value: stats.total,
                        icon: Package,
                        color: 'bg-slate-50 text-slate-500 border-slate-200',
                    },
                    {
                        label: 'Pending',
                        value: stats.pending,
                        icon: Clock,
                        color: 'bg-amber-50 text-amber-600 border-amber-200',
                    },
                    {
                        label: 'In Transit',
                        value: stats.in_transit,
                        icon: Truck,
                        color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
                    },
                    {
                        label: 'Delivered',
                        value: stats.delivered,
                        icon: CheckCircle,
                        color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
                    },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                {stat.label}
                            </span>
                            <div
                                className={`rounded-lg border p-1.5 ${stat.color}`}
                            >
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 text-2xl font-bold text-slate-800">
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Shipments list */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-slate-150 border-b bg-slate-50/20 p-5">
                    <h3 className="text-sm font-bold text-slate-800">
                        Recent Shipments
                    </h3>
                </div>
                {shipments.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-400">
                        No shipments yet.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {shipments.map((s) => (
                            <div
                                key={s.id}
                                onClick={() =>
                                    router.visit(
                                        `/shipments/${s.tracking_number}`,
                                    )
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
                                    {s.estimated_delivery && (
                                        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
                                            <Clock className="h-3 w-3" />
                                            ETA:{' '}
                                            {new Date(
                                                s.estimated_delivery,
                                            ).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusColors[s.status] ?? ''}`}
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                    {s.status.replace('_', ' ')}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
