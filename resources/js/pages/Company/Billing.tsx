import { router, usePage, useForm } from '@inertiajs/react';
import {
    CheckCircle,
    AlertTriangle,
    CreditCard,
    ExternalLink,
} from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';

interface Plan {
    name: string;
    price: number;
    currency: string;
    shipment_limit: number | null;
    features: string[];
}

interface Props {
    plans: Record<string, Plan>;
    subscription: {
        plan: string;
        status: string;
        ends_at: string | null;
        trial_ends: string | null;
    } | null;
    currentPlan: string;
    onTrial: boolean;
    onGracePeriod: boolean;
}

const planColors: Record<string, string> = {
    trial: 'border-slate-200',
    pro: 'border-indigo-500',
    agency: 'border-emerald-500',
};

const planBadge: Record<string, string> = {
    trial: 'bg-slate-100 text-slate-600',
    pro: 'bg-indigo-100 text-indigo-700',
    agency: 'bg-emerald-100 text-emerald-700',
};

export default function Billing({
    plans,
    subscription,
    currentPlan,
    onTrial,
    onGracePeriod,
}: Props) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const urlParams = new URLSearchParams(window.location.search);
    const wasCancelled = urlParams.get('cancelled') === '1';

    const checkout = (plan: string) => {
        router.post('/company/billing/checkout', { plan });
    };

    const openPortal = () => {
        router.post('/company/billing/portal');
    };

    const cancel = () => {
        if (
            confirm(
                'Cancel your subscription? You will retain access until the end of your billing period.',
            )
        ) {
            router.post('/company/billing/cancel');
        }
    };

    const resume = () => {
        router.post('/company/billing/resume');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Billing
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                    Manage your subscription and billing details.
                </p>
            </div>

            {/* Flash */}
            {flash?.success && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    {flash.success}
                </div>
            )}
            {wasCancelled && (
                <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    Payment cancelled. Your plan has not changed.
                </div>
            )}

            {/* Trial banner */}
            {onTrial && (
                <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>
                        You are on a free trial.
                        {subscription?.trial_ends &&
                            ` Trial ends ${new Date(subscription.trial_ends).toLocaleDateString()}.`}
                        Upgrade to keep access after the trial ends.
                    </span>
                </div>
            )}

            {/* Grace period banner */}
            {onGracePeriod && (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>
                            Your subscription has been cancelled.
                            {subscription?.ends_at &&
                                ` Access until ${new Date(subscription.ends_at).toLocaleDateString()}.`}
                        </span>
                    </div>
                    <button
                        onClick={resume}
                        className="shrink-0 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                    >
                        Resume
                    </button>
                </div>
            )}

            {/* Plans */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {Object.entries(plans).map(([key, plan]) => {
                    const isCurrentPlan = currentPlan === key;
                    const canUpgrade =
                        key !== 'trial' && !isCurrentPlan && !onGracePeriod;

                    return (
                        <div
                            key={key}
                            className={`relative flex flex-col rounded-3xl border-2 bg-white p-6 shadow-sm ${
                                isCurrentPlan
                                    ? planColors[key]
                                    : 'border-slate-200'
                            }`}
                        >
                            {isCurrentPlan && (
                                <div
                                    className={`absolute -top-3 left-6 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${planBadge[key]}`}
                                >
                                    Current Plan
                                </div>
                            )}

                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-slate-900">
                                    {plan.name}
                                </h3>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-3xl font-extrabold text-slate-900">
                                        {plan.price === 0
                                            ? 'Free'
                                            : `€${plan.price}`}
                                    </span>
                                    {plan.price > 0 && (
                                        <span className="text-sm text-slate-400">
                                            /month
                                        </span>
                                    )}
                                </div>
                            </div>

                            <ul className="mb-6 flex-1 space-y-2">
                                {plan.features.map((feature, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-2 text-xs text-slate-600"
                                    >
                                        <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {canUpgrade ? (
                                <button
                                    onClick={() => checkout(key)}
                                    className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white transition-all hover:bg-indigo-600"
                                >
                                    Upgrade to {plan.name}
                                </button>
                            ) : isCurrentPlan && key !== 'trial' ? (
                                <button
                                    onClick={openPortal}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    <CreditCard className="h-3.5 w-3.5" />
                                    Manage Billing
                                </button>
                            ) : (
                                <div className="rounded-xl border border-slate-100 bg-slate-50 py-2.5 text-center text-xs font-semibold text-slate-400">
                                    {isCurrentPlan
                                        ? 'Your current plan'
                                        : 'Free'}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Manage subscription */}
            {currentPlan !== 'trial' && !onGracePeriod && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-1 text-sm font-bold text-slate-900">
                        Manage Subscription
                    </h3>
                    <p className="mb-4 text-xs text-slate-500">
                        Update payment method, download invoices, or cancel your
                        subscription.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={openPortal}
                            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-600"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Stripe Customer Portal
                        </button>
                        <button
                            onClick={cancel}
                            className="rounded-xl border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50"
                        >
                            Cancel Subscription
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

Billing.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
