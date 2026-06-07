import { router } from '@inertiajs/react';
import {
    Building2,
    Users,
    Truck,
    DollarSign,
    CheckCircle,
    AlertTriangle,
    Trash2,
} from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { toast } from 'sonner';

interface Company {
    id: number;
    name: string;
    email: string;
    status: string;
    users_count: number;
    shipments_count: number;
    created_at: string;
}

interface Stats {
    total_companies: number;
    active_companies: number;
    trial_companies: number;
    total_shipments: number;
    total_users: number;
    total_revenue: number;
}

interface Props {
    stats: Stats;
    companies: {
        data: Company[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

const statusColors: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    trial: 'bg-amber-50 text-amber-700 border-amber-200',
    suspended: 'bg-red-50 text-red-600 border-red-200',
};

export default function Dashboard({ stats, companies }: Props) {
    const suspend = (company: Company) => {
        toast(`Suspend ${company.name}?`, {
            action: {
                label: 'Suspend',
                onClick: () =>
                    router.post(`/super/companies/${company.id}/suspend`),
            },
            cancel: { label: 'Cancel', onClick: () => {} },
            duration: 8000,
        });
    };

    const activate = (company: Company) => {
        router.post(`/super/companies/${company.id}/activate`);
    };

    const destroy = (company: Company) => {
        toast(`Delete ${company.name}? This cannot be undone.`, {
            action: {
                label: 'Delete',
                onClick: () => router.delete(`/super/companies/${company.id}`),
            },
            cancel: { label: 'Cancel', onClick: () => {} },
            duration: 8000,
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Super Admin
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                    Platform-wide overview and company management.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                    {
                        label: 'Total Companies',
                        value: stats.total_companies,
                        icon: Building2,
                        color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
                    },
                    {
                        label: 'Active Companies',
                        value: stats.active_companies,
                        icon: CheckCircle,
                        color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
                    },
                    {
                        label: 'Total Shipments',
                        value: stats.total_shipments,
                        icon: Truck,
                        color: 'text-blue-600 bg-blue-50 border-blue-100',
                    },
                    {
                        label: 'Total Revenue',
                        value: `€${Number(stats.total_revenue).toLocaleString()}`,
                        icon: DollarSign,
                        color: 'text-amber-600 bg-amber-50 border-amber-100',
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

            {/* Companies table */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-slate-150 border-b bg-slate-50/20 p-5">
                    <h3 className="text-sm font-bold text-slate-800">
                        All Companies
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left whitespace-nowrap">
                        <thead>
                            <tr className="border-slate-150 border-b bg-slate-50 font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                <th className="px-5 py-3">Company</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">Users</th>
                                <th className="px-5 py-3">Shipments</th>
                                <th className="px-5 py-3">Created</th>
                                <th className="px-5 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                            {companies.data.map((company) => (
                                <tr
                                    key={company.id}
                                    className="transition-colors hover:bg-slate-50/60"
                                >
                                    <td className="px-5 py-4">
                                        <div className="font-semibold text-slate-900">
                                            {company.name}
                                        </div>
                                        <div className="mt-0.5 text-[10px] text-slate-400">
                                            {company.email}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusColors[company.status] ?? ''}`}
                                        >
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                            {company.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 font-mono font-bold">
                                        {company.users_count}
                                    </td>
                                    <td className="px-5 py-4 font-mono font-bold">
                                        {company.shipments_count}
                                    </td>
                                    <td className="px-5 py-4 text-slate-400">
                                        {new Date(
                                            company.created_at,
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {company.status === 'suspended' ? (
                                                <button
                                                    onClick={() =>
                                                        activate(company)
                                                    }
                                                    className="flex items-center gap-1 rounded-lg border border-emerald-200 px-2.5 py-1 text-[10px] font-bold text-emerald-600 hover:bg-emerald-50"
                                                >
                                                    <CheckCircle className="h-3 w-3" />
                                                    Activate
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        suspend(company)
                                                    }
                                                    className="flex items-center gap-1 rounded-lg border border-amber-200 px-2.5 py-1 text-[10px] font-bold text-amber-600 hover:bg-amber-50"
                                                >
                                                    <AlertTriangle className="h-3 w-3" />
                                                    Suspend
                                                </button>
                                            )}
                                            <button
                                                onClick={() => destroy(company)}
                                                className="flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-[10px] font-bold text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
