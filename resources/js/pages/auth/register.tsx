import { useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Boxes,
    ArrowRight,
    ArrowLeft,
    Eye,
    EyeOff,
    CheckCircle2,
    ChevronDown,
} from 'lucide-react';

export default function Register() {
    const [step, setStep] = useState<1 | 2>(1);
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        company_name: '',
        entity_type: '',
        fleet_size: '',
    });

    const submitStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.name || !data.email || !data.password) return;
        if (data.password.length < 8) return;
        if (data.password !== data.password_confirmation) return;
        setStep(2);
    };

    const submitStep2 = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    const testimonialBlock = (
        <div className="relative hidden overflow-hidden bg-slate-900 lg:block lg:w-[55%]">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-overlay"
                style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDv9QyET4XuPFFSyqlQ0lTXsApobXMcWKGTo6pYpJXd9lz_HTVX6lLRrRVJNTjqcycBgBnfNGI2CMMbYKJeFERrnzEb9rH9sPk4QDHcEIvP2HdPxnOnl6i2yYbcYraObtGoSG150Oo8PXiwzfI2rsOKtQs5T0bnBvPi5HgrAmwqsx3dZJq3y83L8kL9ISqrrY4QJCGvho0NRNNQ4c0M7PU_FD3F98DKp595U0gMwjjvIWw_RLiEOM82aCFdks4yObBrFvfkzMxQjPM')`,
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
            <div className="absolute right-12 bottom-12 left-12 z-20">
                <div className="max-w-lg rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
                    <div className="mb-3 flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className="h-4 w-4 fill-amber-400"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        ))}
                    </div>
                    <p className="mb-6 text-sm leading-relaxed font-medium text-white">
                        "Since switching our fleet management to FluxCargo, our
                        dispatch efficiency has increased by 40%. The
                        instantaneous data flow and rock-solid reliability are
                        unmatched."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white/30 bg-slate-700" />
                        <div>
                            <h5 className="text-xs font-bold text-white">
                                David Chen
                            </h5>
                            <span className="block text-[10px] text-slate-300">
                                Operations Director, Apex Transport
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen w-full bg-[#f8f9ff]">
            <div className="flex w-full lg:h-screen">
                {/* Form side */}
                <div className="flex w-full flex-col justify-center overflow-y-auto bg-white p-6 sm:p-12 lg:w-[45%] lg:p-20">
                    <div className="flex w-full max-w-[400px] flex-col gap-6">
                        <div className="flex items-center gap-2.5">
                            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-1.5">
                                <Boxes className="h-5 w-5 animate-pulse text-indigo-600" />
                            </div>
                            <span className="text-lg font-extrabold tracking-tight text-slate-900">
                                FluxCargo
                            </span>
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Create an account
                            </h1>
                            <p className="mt-1 text-xs text-slate-500">
                                Join FluxCargo to streamline your logistics
                                operations.
                            </p>
                        </div>

                        {/* Stepper */}
                        <div>
                            {step === 1 ? (
                                <>
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="h-1.5 flex-1 rounded-full bg-indigo-600" />
                                        <div className="h-1.5 flex-1 rounded-full bg-slate-100" />
                                    </div>
                                    <div className="flex justify-between font-mono text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                        <span className="text-indigo-600">
                                            1. Account basics
                                        </span>
                                        <span>2. Company details</span>
                                    </div>
                                </>
                            ) : (
                                <div className="mb-3 flex items-center gap-2">
                                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                                        <span className="text-[10px] font-bold">
                                            ✓
                                        </span>
                                    </div>
                                    <span className="font-mono text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                        Account Basics
                                    </span>
                                    <div className="h-px flex-1 bg-slate-200" />
                                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                                        2
                                    </div>
                                    <span className="font-mono text-[11px] font-bold tracking-wider text-slate-900 uppercase">
                                        Company details
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Error */}
                        <AnimatePresence>
                            {Object.keys(errors).length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700"
                                >
                                    {Object.values(errors)[0]}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Step 1 */}
                        {step === 1 && (
                            <form
                                onSubmit={submitStep1}
                                className="flex flex-col gap-4"
                            >
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-mono text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                        Full name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Jane Doe"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-800 transition-all focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-mono text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                        Work email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="jane@company.com"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-800 transition-all focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-mono text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={data.password}
                                            onChange={(e) => {
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                );
                                            }}
                                            placeholder="••••••••"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-10 pl-4 text-xs text-slate-800 transition-all focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="font-mono text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={
                                                    data.password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        'password_confirmation',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="••••••••"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-10 pl-4 text-xs text-slate-800 transition-all focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
                                                required
                                            />
                                        </div>
                                        {errors.password_confirmation && (
                                            <p className="text-xs text-red-500">
                                                {errors.password_confirmation}
                                            </p>
                                        )}
                                    </div>

                                    <p className="text-[10px] text-slate-400">
                                        Must be at least 8 characters long.
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-semibold tracking-wide text-white shadow-sm transition-all hover:bg-indigo-600"
                                >
                                    <span>Continue</span>
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </form>
                        )}

                        {/* Step 2 */}
                        {step === 2 && (
                            <form
                                onSubmit={submitStep2}
                                className="flex flex-col gap-4"
                            >
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-mono text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.company_name}
                                        onChange={(e) =>
                                            setData(
                                                'company_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g. Acme Logistics"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-800 transition-all focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
                                        required
                                    />
                                    {errors.company_name && (
                                        <p className="text-xs text-red-500">
                                            {errors.company_name}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-mono text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                        Legal Entity Type
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={data.entity_type}
                                            onChange={(e) =>
                                                setData(
                                                    'entity_type',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pr-10 text-xs text-slate-800 transition-all focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
                                        >
                                            <option value="">
                                                Select entity type
                                            </option>
                                            <option value="corporation">
                                                Corporation
                                            </option>
                                            <option value="llc">LLC</option>
                                            <option value="partnership">
                                                Partnership
                                            </option>
                                            <option value="sole_proprietorship">
                                                Sole Proprietorship
                                            </option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-mono text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                        Fleet Size
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={data.fleet_size}
                                            onChange={(e) =>
                                                setData(
                                                    'fleet_size',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pr-10 text-xs text-slate-800 transition-all focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
                                        >
                                            <option value="">
                                                Select fleet size
                                            </option>
                                            <option value="1-10">
                                                1–10 trucks
                                            </option>
                                            <option value="11-50">
                                                11–50 trucks
                                            </option>
                                            <option value="51-200">
                                                51–200 trucks
                                            </option>
                                            <option value="201+">
                                                201+ trucks
                                            </option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>
                                <div className="mt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        <ArrowLeft className="h-4 w-4 text-slate-500" />
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-semibold text-white shadow-sm hover:bg-indigo-600 disabled:opacity-60"
                                    >
                                        <span>
                                            {processing
                                                ? 'Creating account...'
                                                : 'Complete Registration'}
                                        </span>
                                        <CheckCircle2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </form>
                        )}

                        <p className="text-center text-xs text-slate-500">
                            Already have an account?
                            <Link
                                href="/login"
                                className="ml-1 font-bold text-indigo-600 hover:underline"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>

                {testimonialBlock}
            </div>
        </div>
    );
}
