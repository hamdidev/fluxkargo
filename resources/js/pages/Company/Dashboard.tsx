import { Link, router } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
const DashboardMap = lazy(() => import('@/components/DashboardMap'));
import {
    Package,
    TrendingUp,
    Truck,
    CheckCircle,
    AlertTriangle,
    ArrowRight,
    PlusSquare,
    UserPlus,
    SlidersHorizontal,
} from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { openCreateShipmentModal } from '@/utils/events';

interface Shipment {
    id: number;
    tracking_number: string;
    status: string;
    destination_city: string;
    estimated_delivery: string | null;
    customer: { name: string };
    driver: { name: string } | null;
}

interface ActivityItem {
    id: number;
    to_status: string;
    from_status: string | null;
    note: string | null;
    created_at: string;
    user: { name: string; role: string };
    shipment: { tracking_number: string; id: number };
}

interface Stats {
    total: number;
    in_transit: number;
    delivered: number;
    exceptions: number;
}

interface Props {
    stats: Stats;
    recentShipments: Shipment[];
    activities: ActivityItem[];
    activeShipments: {
        id: number;
        tracking_number: string;
        origin_lat: number;
        origin_lng: number;
        destination_lat: number;
        destination_lng: number;
        origin_city: string;
        destination_city: string;
        status: string;
    }[];
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

const statusDot: Record<string, string> = {
    delivered: 'bg-emerald-500',
    failed: 'bg-red-500',
    cancelled: 'bg-slate-400',
    in_transit: 'bg-indigo-500',
    out_for_delivery: 'bg-orange-500',
    pending: 'bg-slate-400',
    assigned: 'bg-blue-500',
    picked_up: 'bg-indigo-500',
};

const activityColor: Record<string, string> = {
    delivered: 'bg-emerald-50 text-emerald-600 border-emerald-150',
    failed: 'bg-red-50 text-red-600 border-red-150',
    picked_up: 'bg-indigo-50 text-indigo-700 border-indigo-150',
    in_transit: 'bg-indigo-50 text-indigo-700 border-indigo-150',
};

export default function Dashboard({
    stats,
    recentShipments,
    activities,
    activeShipments,
}: Props) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Dashboard
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Overview of today's logistics and fleet operations.
                    </p>
                </div>
                <div className="flex w-full gap-3 sm:w-auto">
                    <Link
                        href="/company/drivers"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 sm:flex-none"
                    >
                        <UserPlus className="h-4 w-4 text-slate-400" />
                        <span>Assign Driver</span>
                    </Link>
                    <button
                        onClick={openCreateShipmentModal}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-900 active:scale-[0.98] sm:flex-none"
                    >
                        <PlusSquare className="h-4 w-4" />
                        <span>Create Shipment</span>
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            Total Shipments
                        </span>
                        <div className="border-slate-150 rounded-lg border bg-slate-50 p-1 px-1.5 text-slate-400">
                            <Package className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-bold tracking-tight text-slate-800">
                            {stats.total.toLocaleString()}
                        </span>
                        <div className="mt-2.5 flex items-center gap-1.5 text-emerald-600">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold tracking-wide">
                                All time
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            In Transit
                        </span>
                        <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-1 px-1.5 text-indigo-600">
                            <Truck className="h-4 w-4 animate-pulse" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-bold tracking-tight text-slate-800">
                            {stats.in_transit}
                        </span>
                        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-indigo-500"
                                style={{
                                    width: stats.total
                                        ? `${Math.round((stats.in_transit / stats.total) * 100)}%`
                                        : '0%',
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            Delivered
                        </span>
                        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-1 px-1.5 text-emerald-600">
                            <CheckCircle className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-bold tracking-tight text-slate-800">
                            {stats.delivered}
                        </span>
                        <div className="mt-2.5 flex items-center gap-1.5 text-emerald-600">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold tracking-wide">
                                Completed
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-l-4 border-slate-200 border-l-red-500 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            Exceptions
                        </span>
                        <div className="rounded-lg border border-red-100 bg-red-50 p-1 px-1.5 text-red-500">
                            <AlertTriangle
                                className="h-4 w-4 animate-bounce"
                                style={{ animationDuration: '3s' }}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-extrabold tracking-tight text-slate-800">
                            {stats.exceptions}
                        </span>
                        <div className="mt-2.5 flex items-center gap-1 text-red-500">
                            <span className="text-[10px] font-bold tracking-wider uppercase">
                                Requires attention
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left: Shipments table */}
                <div className="space-y-6 lg:col-span-2">
                    <div className="flex h-[280px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-slate-150 flex items-center justify-between border-b bg-slate-50/20 p-5">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 animate-ping rounded-full bg-indigo-600" />
                                <h3 className="text-sm font-bold text-slate-800">
                                    Live Tracking Map
                                </h3>
                            </div>
                            <Link
                                href="/shipments"
                                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                            >
                                View All
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                        <div className="flex-1">
                            {activeShipments.length > 0 ? (
                                <Suspense
                                    fallback={
                                        <div className="flex h-full items-center justify-center bg-slate-50">
                                            <p className="font-mono text-xs text-slate-400">
                                                Loading map...
                                            </p>
                                        </div>
                                    }
                                >
                                    <DashboardMap shipments={activeShipments} />
                                </Suspense>
                            ) : (
                                <div className="flex h-full items-center justify-center bg-slate-50">
                                    <p className="font-mono text-xs text-slate-400">
                                        No active shipments to display
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Shipments */}
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-slate-150 flex items-center justify-between border-b bg-slate-50/20 p-5">
                            <h3 className="text-sm font-bold text-slate-800">
                                Active Shipments
                            </h3>
                            <Link
                                href="/shipments"
                                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left whitespace-nowrap">
                                <thead>
                                    <tr className="border-slate-150 border-b bg-slate-50 font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                        <th className="px-5 py-3">
                                            Tracking ID
                                        </th>
                                        <th className="px-5 py-3">
                                            Destination
                                        </th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3 text-right">
                                            ETA
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                                    {recentShipments.map((s) => (
                                        <tr
                                            key={s.id}
                                            onClick={() =>
                                                router.visit(
                                                    `/shipments/${s.tracking_number}`,
                                                )
                                            }
                                            className="group cursor-pointer transition-colors hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-3.5 font-mono font-bold tracking-tight text-indigo-600 group-hover:underline">
                                                {s.tracking_number}
                                            </td>
                                            <td className="px-5 py-3.5 font-medium text-slate-900">
                                                {s.destination_city}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusColors[s.status] ?? ''}`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${statusDot[s.status] ?? 'bg-slate-400'}`}
                                                    />
                                                    {s.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td
                                                className={`px-5 py-3.5 text-right font-medium ${['failed', 'cancelled'].includes(s.status) ? 'font-bold text-red-600' : 'text-slate-500'}`}
                                            >
                                                {s.estimated_delivery
                                                    ? new Date(
                                                          s.estimated_delivery,
                                                      ).toLocaleDateString()
                                                    : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                    {recentShipments.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="py-8 text-center text-xs text-slate-400"
                                            >
                                                No shipments yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right: Activity Feed */}
                <div className="lg:col-span-1">
                    <div className="flex h-full min-h-[500px] flex-col rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-slate-150 border-b bg-slate-50/20 p-5">
                            <h3 className="text-sm font-bold text-slate-800">
                                Live Activity Feed
                            </h3>
                        </div>
                        <div className="flex-1 space-y-6 overflow-y-auto p-5">
                            {activities.map((act, index) => {
                                const isLast = index === activities.length - 1;
                                const color =
                                    activityColor[act.to_status] ??
                                    'bg-slate-50 text-slate-500 border-slate-200';
                                return (
                                    <div
                                        key={act.id}
                                        className="relative flex gap-3"
                                    >
                                        {!isLast && (
                                            <div className="bg-slate-150 absolute top-8 bottom-[-24px] left-3.5 w-px" />
                                        )}
                                        <div
                                            className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border text-[10px] font-bold ${color}`}
                                        >
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs leading-relaxed text-slate-800">
                                                <span
                                                    onClick={() =>
                                                        router.visit(
                                                            `/shipments/${act.shipment.id}`,
                                                        )
                                                    }
                                                    className="mr-1 cursor-pointer font-mono font-bold text-slate-900 hover:underline"
                                                >
                                                    {
                                                        act.shipment
                                                            .tracking_number
                                                    }
                                                </span>
                                                moved to{' '}
                                                <span className="font-bold">
                                                    {act.to_status.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </span>
                                                {act.note && (
                                                    <span className="text-slate-500">
                                                        {' '}
                                                        — {act.note}
                                                    </span>
                                                )}
                                            </p>
                                            <span className="mt-1 block font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                {new Date(
                                                    act.created_at,
                                                ).toLocaleTimeString()}{' '}
                                                · {act.user.name}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            {activities.length === 0 && (
                                <p className="py-8 text-center text-xs text-slate-400">
                                    No activity yet.
                                </p>
                            )}
                        </div>
                        <div className="border-slate-150 border-t bg-slate-50/50 p-4">
                            <Link
                                href="/shipments"
                                className="block w-full py-2.5 text-center text-xs font-bold text-indigo-700 hover:underline"
                            >
                                View All Shipments
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
