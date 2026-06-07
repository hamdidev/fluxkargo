import { router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    UserPlus,
    X,
    Truck,
    User,
    Key,
    Trash2,
    CheckCircle,
    AlertTriangle,
} from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { toast } from 'sonner';

interface Member {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    status: string;
    created_at: string;
}

interface Props {
    members: Member[];
}

export default function Team({ members }: Props) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        role: 'driver',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/company/team', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    const suspend = (member: Member) => {
        router.post(`/company/team/${member.id}/suspend`);
    };

    const activate = (member: Member) => {
        router.post(`/company/team/${member.id}/activate`);
    };

    const resetPassword = (member: Member) => {
        toast(`Reset password for ${member.name}?`, {
            action: {
                label: 'Reset',
                onClick: () =>
                    router.post(`/company/team/${member.id}/reset-password`),
            },
            cancel: { label: 'Cancel', onClick: () => {} },
            duration: 8000,
        });
    };

    const destroy = (member: Member) => {
        toast(`Remove ${member.name} from the team?`, {
            action: {
                label: 'Remove',
                onClick: () => router.delete(`/company/team/${member.id}`),
            },
            cancel: { label: 'Cancel', onClick: () => {} },
            duration: 8000,
        });
    };

    const drivers = members.filter((m) => m.role === 'driver');
    const customers = members.filter((m) => m.role === 'customer');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Team
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Manage drivers and customers in your company.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-indigo-600"
                >
                    <UserPlus className="h-4 w-4" />
                    Add Member
                </button>
            </div>

            {/* Flash success — shows generated password */}
            {flash?.success && (
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                        <p className="font-semibold">{flash.success}</p>
                        <p className="mt-1 text-xs text-emerald-600">
                            Share these credentials securely with the team
                            member.
                        </p>
                    </div>
                </div>
            )}

            {/* Drivers */}
            <MemberTable
                title="Drivers"
                icon={<Truck className="h-4 w-4 text-slate-400" />}
                members={drivers}
                onSuspend={suspend}
                onActivate={activate}
                onResetPassword={resetPassword}
                onDestroy={destroy}
            />

            {/* Customers */}
            <MemberTable
                title="Customers"
                icon={<User className="h-4 w-4 text-slate-400" />}
                members={customers}
                onSuspend={suspend}
                onActivate={activate}
                onResetPassword={resetPassword}
                onDestroy={destroy}
            />

            {/* Add Member Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                            <h3 className="text-sm font-bold text-slate-900">
                                Add Team Member
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <form onSubmit={submit} className="space-y-4 p-6">
                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                    Role
                                </label>
                                <div className="flex gap-3">
                                    {['driver', 'customer', 'dispatcher'].map(
                                        (r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() =>
                                                    setData('role', r)
                                                }
                                                className={`flex-1 rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                                                    data.role === r
                                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                                                }`}
                                            >
                                                {r === 'driver'
                                                    ? '🚚 Driver'
                                                    : r === 'customer'
                                                      ? '👤 Customer'
                                                      : '📋 Dispatcher'}
                                            </button>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-[10px] text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1 text-[10px] text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                    Phone (optional)
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div className="border-slate-150 flex justify-end gap-3 border-t pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                                >
                                    {processing
                                        ? 'Creating...'
                                        : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function MemberTable({
    title,
    icon,
    members,
    onSuspend,
    onActivate,
    onResetPassword,
    onDestroy,
}: {
    title: string;
    icon: React.ReactNode;
    members: Member[];
    onSuspend: (m: Member) => void;
    onActivate: (m: Member) => void;
    onResetPassword: (m: Member) => void;
    onDestroy: (m: Member) => void;
}) {
    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-slate-150 flex items-center gap-2 border-b bg-slate-50/20 p-5">
                {icon}
                <h3 className="text-sm font-bold text-slate-800">{title}</h3>
                <span className="ml-auto font-mono text-[10px] font-bold text-slate-400">
                    {members.length} total
                </span>
            </div>
            {members.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                    No {title.toLowerCase()} yet.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left whitespace-nowrap">
                        <thead>
                            <tr className="border-b bg-slate-50 font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                <th className="px-5 py-3">Name</th>
                                <th className="px-5 py-3">Email</th>
                                <th className="px-5 py-3">Phone</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">Joined</th>
                                <th className="px-5 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                            {members.map((member) => (
                                <tr
                                    key={member.id}
                                    className="transition-colors hover:bg-slate-50/60"
                                >
                                    <td className="px-5 py-3.5 font-semibold">
                                        {member.name}
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-500">
                                        {member.email}
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-500">
                                        {member.phone ?? '—'}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                                                member.status === 'active'
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                    : 'border-red-200 bg-red-50 text-red-600'
                                            }`}
                                        >
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-400">
                                        {new Date(
                                            member.created_at,
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center justify-end gap-2">
                                            {member.status === 'suspended' ? (
                                                <button
                                                    onClick={() =>
                                                        onActivate(member)
                                                    }
                                                    className="rounded-lg border border-emerald-200 px-2 py-1 text-[10px] font-bold text-emerald-600 hover:bg-emerald-50"
                                                >
                                                    Activate
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        onSuspend(member)
                                                    }
                                                    className="rounded-lg border border-amber-200 px-2 py-1 text-[10px] font-bold text-amber-600 hover:bg-amber-50"
                                                >
                                                    Suspend
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    onResetPassword(member)
                                                }
                                                className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-50"
                                            >
                                                <Key className="h-3 w-3" />
                                                Reset
                                            </button>
                                            <button
                                                onClick={() =>
                                                    onDestroy(member)
                                                }
                                                className="flex items-center gap-1 rounded-lg border border-red-200 px-2 py-1 text-[10px] font-bold text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

Team.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
