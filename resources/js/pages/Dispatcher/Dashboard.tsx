import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    UserCheck,
    AlertTriangle,
} from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { toast } from 'sonner';

interface Shipment {
    id: number;
    tracking_number: string;
    status: string;
    origin_city: string;
    destination_city: string;
    customer: { name: string };
    driver: { id: number; name: string } | null;
}

interface Driver {
    id: number;
    name: string;
}

interface Stats {
    total: number;
    pending: number;
    in_transit: number;
    delivered: number;
}

interface Props {
    stats: Stats;
    pendingShipments: Shipment[];
    activeShipments: Shipment[];
    drivers: Driver[];
}

function AssignDriverModal({
    shipment,
    drivers,
    onClose,
}: {
    shipment: Shipment;
    drivers: Driver[];
    onClose: () => void;
}) {
    const { data, setData, put, processing } = useForm({
        driver_id: shipment.driver?.id?.toString() ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/shipments/${shipment.tracking_number}`, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
                <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                    <h3 className="text-sm font-bold text-slate-900">
                        Assign Driver
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                        {shipment.tracking_number}
                    </p>
                </div>
                <form onSubmit={submit} className="space-y-4 p-6">
                    <div>
                        <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                            Driver
                        </label>
                        <select
                            value={data.driver_id}
                            onChange={(e) =>
                                setData('driver_id', e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                            required
                        >
                            <option value="">Select driver</option>
                            {drivers.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !data.driver_id}
                            className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {processing ? 'Assigning...' : 'Assign'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Dashboard({
    stats,
    pendingShipments,
    activeShipments,
    drivers,
}: Props) {
    const [assigningShipment, setAssigningShipment] = useState<Shipment | null>(
        null,
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Dispatch Center
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                    Manage shipment assignments and monitor active deliveries.
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

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Pending — needs driver assignment */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-slate-150 flex items-center gap-2 border-b bg-slate-50/20 p-5">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <h3 className="text-sm font-bold text-slate-800">
                            Needs Assignment
                        </h3>
                        <span className="ml-auto rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-600">
                            {pendingShipments.length}
                        </span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {pendingShipments.length === 0 ? (
                            <p className="py-8 text-center text-xs text-slate-400">
                                All shipments assigned.
                            </p>
                        ) : (
                            pendingShipments.map((s) => (
                                <div
                                    key={s.id}
                                    className="flex items-center justify-between p-4 hover:bg-slate-50"
                                >
                                    <div>
                                        <p className="font-mono text-xs font-bold text-indigo-600">
                                            {s.tracking_number}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {s.origin_city} →{' '}
                                            {s.destination_city}
                                        </p>
                                        <p className="mt-0.5 text-[10px] text-slate-400">
                                            {s.customer.name}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setAssigningShipment(s)}
                                        className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-indigo-700"
                                    >
                                        <UserCheck className="h-3 w-3" />
                                        Assign
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Active shipments */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-slate-150 flex items-center gap-2 border-b bg-slate-50/20 p-5">
                        <Truck className="h-4 w-4 text-indigo-500" />
                        <h3 className="text-sm font-bold text-slate-800">
                            Active Deliveries
                        </h3>
                        <span className="ml-auto rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-600">
                            {activeShipments.length}
                        </span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {activeShipments.length === 0 ? (
                            <p className="py-8 text-center text-xs text-slate-400">
                                No active deliveries.
                            </p>
                        ) : (
                            activeShipments.map((s) => (
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
                                            {s.origin_city} →{' '}
                                            {s.destination_city}
                                        </p>
                                        <p className="mt-0.5 text-[10px] text-slate-400">
                                            Driver:{' '}
                                            {s.driver?.name ?? 'Unassigned'}
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                                            s.status === 'in_transit'
                                                ? 'border border-indigo-200 bg-indigo-50 text-indigo-700'
                                                : s.status ===
                                                    'out_for_delivery'
                                                  ? 'border border-orange-200 bg-orange-50 text-orange-700'
                                                  : 'border border-blue-200 bg-blue-50 text-blue-700'
                                        }`}
                                    >
                                        {s.status.replace('_', ' ')}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Assign driver modal */}
            {assigningShipment && (
                <AssignDriverModal
                    shipment={assigningShipment}
                    drivers={drivers}
                    onClose={() => setAssigningShipment(null)}
                />
            )}
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
