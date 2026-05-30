import { router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    Filter,
    Eye,
    ChevronLeft,
    ChevronRight,
    Calendar,
    User,
    Sliders,
} from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';

interface Shipment {
    id: number;
    tracking_number: string;
    status: string;
    origin_address: string;
    origin_city: string;
    destination_address: string;
    destination_city: string;
    customer: { name: string };
    driver: { name: string } | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    shipments: {
        data: Shipment[];
        links: PaginationLink[];
        from: number;
        to: number;
        total: number;
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        status?: string;
        timeframe?: string;
        driver_id?: string;
    };
    drivers: { id: number; name: string }[];
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
    pending: 'bg-slate-400',
    assigned: 'bg-blue-500',
    picked_up: 'bg-indigo-500',
    in_transit: 'bg-indigo-500',
    out_for_delivery: 'bg-orange-500',
    delivered: 'bg-emerald-500',
    failed: 'bg-red-500',
    cancelled: 'bg-slate-400',
};

const ALL_STATUSES = [
    'pending',
    'assigned',
    'picked_up',
    'in_transit',
    'out_for_delivery',
    'delivered',
    'failed',
    'cancelled',
];

export default function Index({ shipments, filters, drivers }: Props) {
    const [statusFilter, setStatusFilter] = useState(filters.status ?? 'all');
    const [timeFilter, setTimeFilter] = useState(filters.timeframe ?? 'all');
    const [driverFilter, setDriverFilter] = useState(
        filters.driver_id ?? 'all',
    );

    const applyFilters = (overrides: Record<string, string>) => {
        router.get(
            '/shipments',
            {
                ...filters,
                status: statusFilter,
                timeframe: timeFilter,
                driver_id: driverFilter,
                ...overrides,
            },
            { preserveState: true, replace: true },
        );
    };

    const clearFilters = () => {
        setStatusFilter('all');
        setTimeFilter('all');
        setDriverFilter('all');
        router.get('/shipments', {}, { preserveState: false });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Active Shipments
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                    Manage, filter, and track ongoing shipments.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:flex-nowrap">
                {/* Status */}
                <div className="relative shrink-0">
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            applyFilters({ status: e.target.value });
                        }}
                        className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pr-9 pl-8 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                    >
                        <option value="all">All Statuses</option>
                        {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s.replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                    <Filter className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                </div>

                {/* Timeframe */}
                <div className="relative shrink-0">
                    <select
                        value={timeFilter}
                        onChange={(e) => {
                            setTimeFilter(e.target.value);
                            applyFilters({ timeframe: e.target.value });
                        }}
                        className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pr-9 pl-8 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                    >
                        <option value="all">All Timeframes</option>
                        <option value="today">Last 24 Hours</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                    </select>
                    <Calendar className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                </div>

                {/* Driver */}
                <div className="relative shrink-0">
                    <select
                        value={driverFilter}
                        onChange={(e) => {
                            setDriverFilter(e.target.value);
                            applyFilters({ driver_id: e.target.value });
                        }}
                        className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pr-9 pl-8 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                    >
                        <option value="all">All Drivers</option>
                        {drivers.map((d) => (
                            <option key={d.id} value={String(d.id)}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                    <User className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                </div>

                <div className="hidden h-6 w-px bg-slate-200 md:block" />

                <button
                    onClick={clearFilters}
                    className="cursor-pointer px-2.5 py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline sm:ml-auto"
                >
                    Clear All
                </button>
            </div>

            {/* Table */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left whitespace-nowrap">
                        <thead>
                            <tr className="border-slate-150 border-b bg-slate-50 font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                <th className="px-5 py-3">Tracking #</th>
                                <th className="px-5 py-3">Origin</th>
                                <th className="px-5 py-3">Destination</th>
                                <th className="px-5 py-3">Customer</th>
                                <th className="px-5 py-3">Driver</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">Created</th>
                                <th className="px-5 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                            {shipments.data.map((s) => (
                                <tr
                                    key={s.id}
                                    onClick={() =>
                                        router.visit(
                                            `/shipments/${s.tracking_number}`,
                                        )
                                    }
                                    className="group cursor-pointer transition-colors hover:bg-slate-50/60"
                                >
                                    <td className="px-5 py-4 font-mono font-bold tracking-tight text-indigo-600 group-hover:underline">
                                        {s.tracking_number}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="font-semibold text-slate-800">
                                            {s.origin_city}
                                        </div>
                                        <div className="mt-0.5 max-w-[150px] truncate text-[10px] text-slate-400">
                                            {s.origin_address}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="font-semibold text-slate-800">
                                            {s.destination_city}
                                        </div>
                                        <div className="mt-0.5 max-w-[150px] truncate text-[10px] text-slate-400">
                                            {s.destination_address}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-medium text-slate-700">
                                        {s.customer?.name}
                                    </td>
                                    <td className="px-5 py-4 font-medium text-slate-500">
                                        {s.driver?.name ?? '—'}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusColors[s.status] ?? ''}`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${statusDot[s.status] ?? 'bg-slate-400'}`}
                                            />
                                            {s.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 font-medium text-slate-400">
                                        {new Date(
                                            s.created_at,
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.visit(
                                                    `/shipments/${s.id}`,
                                                );
                                            }}
                                            className="cursor-pointer rounded-xl p-1 px-1.5 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-100 hover:text-indigo-600"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {shipments.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-12 text-center text-xs text-slate-400"
                                    >
                                        No shipments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="border-slate-150 flex items-center justify-between border-t bg-slate-50/50 p-5 text-xs text-slate-500">
                    <div>
                        Showing{' '}
                        <span className="font-semibold text-slate-800">
                            {shipments.from ?? 0}
                        </span>{' '}
                        to{' '}
                        <span className="font-semibold text-slate-800">
                            {shipments.to ?? 0}
                        </span>{' '}
                        of{' '}
                        <span className="font-semibold text-slate-800">
                            {shipments.total}
                        </span>{' '}
                        results
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() =>
                                shipments.current_page > 1 &&
                                router.visit(
                                    `/shipments?page=${shipments.current_page - 1}`,
                                )
                            }
                            disabled={shipments.current_page === 1}
                            className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        {Array.from(
                            { length: Math.min(shipments.last_page, 5) },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <button
                                key={page}
                                onClick={() =>
                                    router.visit(`/shipments?page=${page}`)
                                }
                                className={`flex h-9 w-9 items-center justify-center rounded-xl font-semibold ${
                                    page === shipments.current_page
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'cursor-pointer text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        {shipments.last_page > 5 && (
                            <span className="px-1 text-slate-400">...</span>
                        )}

                        <button
                            onClick={() =>
                                shipments.current_page < shipments.last_page &&
                                router.visit(
                                    `/shipments?page=${shipments.current_page + 1}`,
                                )
                            }
                            disabled={
                                shipments.current_page === shipments.last_page
                            }
                            className="cursor-pointer rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
