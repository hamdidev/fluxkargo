// import { Form, Head } from '@inertiajs/react';
// import InputError from '@/components/input-error';
// import PasskeyVerify from '@/components/passkey-verify';
// import PasswordInput from '@/components/password-input';
// import TextLink from '@/components/text-link';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Spinner } from '@/components/ui/spinner';
// import { register } from '@/routes';
// import { store } from '@/routes/login';
// import { request } from '@/routes/password';

// type Props = {
//     status?: string;
//     canResetPassword: boolean;
// };

// export default function Login({ status, canResetPassword }: Props) {
//     return (
//         <>
//             <Head title="Log in" />

//             <PasskeyVerify />

//             <Form
//                 {...store.form()}
//                 resetOnSuccess={['password']}
//                 className="flex flex-col gap-6"
//             >
//                 {({ processing, errors }) => (
//                     <>
//                         <div className="grid gap-6">
//                             <div className="grid gap-2">
//                                 <Label htmlFor="email">Email address</Label>
//                                 <Input
//                                     id="email"
//                                     type="email"
//                                     name="email"
//                                     required
//                                     autoFocus
//                                     tabIndex={1}
//                                     autoComplete="email"
//                                     placeholder="email@example.com"
//                                 />
//                                 <InputError message={errors.email} />
//                             </div>

//                             <div className="grid gap-2">
//                                 <div className="flex items-center">
//                                     <Label htmlFor="password">Password</Label>
//                                     {canResetPassword && (
//                                         <TextLink
//                                             href={request()}
//                                             className="ml-auto text-sm"
//                                             tabIndex={5}
//                                         >
//                                             Forgot your password?
//                                         </TextLink>
//                                     )}
//                                 </div>
//                                 <PasswordInput
//                                     id="password"
//                                     name="password"
//                                     required
//                                     tabIndex={2}
//                                     autoComplete="current-password"
//                                     placeholder="Password"
//                                 />
//                                 <InputError message={errors.password} />
//                             </div>

//                             <div className="flex items-center space-x-3">
//                                 <Checkbox
//                                     id="remember"
//                                     name="remember"
//                                     tabIndex={3}
//                                 />
//                                 <Label htmlFor="remember">Remember me</Label>
//                             </div>

//                             <Button
//                                 type="submit"
//                                 className="mt-4 w-full"
//                                 tabIndex={4}
//                                 disabled={processing}
//                                 data-test="login-button"
//                             >
//                                 {processing && <Spinner />}
//                                 Log in
//                             </Button>
//                         </div>

//                         <div className="text-center text-sm text-muted-foreground">
//                             Don't have an account?{' '}
//                             <TextLink href={register()} tabIndex={5}>
//                                 Sign up
//                             </TextLink>
//                         </div>
//                     </>
//                 )}
//             </Form>

//             {status && (
//                 <div className="mb-4 text-center text-sm font-medium text-green-600">
//                     {status}
//                 </div>
//             )}
//         </>
//     );
// }

// Login.layout = {
//     title: 'Log in to your account',
//     description: 'Enter your email and password below to log in',
// };
import { useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="flex min-h-screen w-full bg-[#f8f9ff] text-[#0b1c30]">
            <div className="flex h-full w-full lg:h-screen">
                {/* Left Column: Branding */}
                <div className="relative hidden w-[45%] flex-col justify-between bg-[#131b2e] p-12 text-slate-300 lg:flex">
                    <div className="absolute inset-0 z-0">
                        <img
                            alt="Logistics background"
                            className="h-full w-full object-cover opacity-25 mix-blend-luminosity"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJAoesKAuyFwFDKn7KYcss_o-hJpx7K0LcrIEgo6EEDaLcqRDfZl4CwK3uB-UeFOAzHA3CfyCxbqShg6bgJiqLYCG_2ZGsXkPT1t7NFIgt3Gm4GPRA91qfkqkLd2W0OcXBpBDZBSukc234JAa4oZS54_zrAKvoAn2Qk5oo4niw1zRvtiMlCBcPmWS7N7AB5L_-3urZsmc5i2-7DTP36sMQ_w0ZmlbPlDsO2scvQBNyq55Tv-n-mE_X7AXTgHaJcxLGVEOPDJY6u_E"
                        />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl border border-white/10 bg-white/10 p-2 backdrop-blur-sm">
                                <LayoutGrid className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">
                                FluxKargo
                            </span>
                        </div>
                    </div>
                    <div className="relative z-10 max-w-md">
                        <h1 className="mb-4 text-3xl leading-none font-extrabold tracking-tight text-white">
                            The backbone of modern logistics.
                        </h1>
                        <p className="text-xs leading-relaxed text-slate-400 opacity-90">
                            Streamline operations, optimize routes, and track
                            shipments in real-time with unparalleled precision
                            and zero operational overhead.
                        </p>
                    </div>
                    <div className="relative z-10 flex items-center gap-2 font-mono text-[10px] text-slate-500">
                        <span>FLUXCARGO PLATFORM</span>
                        <span>•</span>
                        <span>SECURE DISPATCH AUTH</span>
                    </div>
                </div>

                {/* Right Column: Login Form */}
                <div className="flex w-full items-center justify-center overflow-y-auto bg-white p-6 sm:p-12 lg:w-[55%] lg:p-20">
                    <div className="flex w-full max-w-[400px] flex-col gap-6">
                        {/* Mobile brand */}
                        <div className="mb-2 flex items-center gap-2.5 lg:hidden">
                            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-1.5">
                                <LayoutGrid className="h-5 w-5 text-indigo-600" />
                            </div>
                            <span className="text-lg font-extrabold tracking-tight text-slate-900">
                                FluxKargo
                            </span>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Welcome back
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Sign in to your account with corporate
                                credentials.
                            </p>
                        </div>

                        {/* Error */}
                        <AnimatePresence>
                            {errors.email && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700"
                                >
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
                                    {errors.email}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={submit} className="flex flex-col gap-4">
                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className="font-mono text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="name@company.com"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-4 pl-10 text-xs text-slate-800 transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="font-mono text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                        Password
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-[11px] font-semibold text-indigo-600 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-10 pl-10 text-xs text-slate-800 transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center gap-2 py-1 select-none">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    className="h-4 w-4 cursor-pointer rounded border-slate-200 bg-slate-50 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                    htmlFor="remember"
                                    className="cursor-pointer text-xs text-slate-500"
                                >
                                    Remember me for 30 days
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-semibold tracking-wide text-white shadow-sm transition-all hover:bg-indigo-600 disabled:opacity-60"
                            >
                                <span>
                                    {processing ? 'Signing in...' : 'Sign In'}
                                </span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative flex items-center py-1">
                            <div className="flex-grow border-t border-slate-200/60"></div>
                            <span className="mx-4 flex-shrink-0 font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                                or continue with
                            </span>
                            <div className="flex-grow border-t border-slate-200/60"></div>
                        </div>

                        {/* Social */}
                        <div className="grid grid-cols-2 gap-3">
                            <a
                                href="/auth/google"
                                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span>Google</span>
                            </a>
                            <button
                                disabled
                                className="flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-400 opacity-50"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 21 21">
                                    <rect
                                        fill="#f25022"
                                        height="9"
                                        width="9"
                                        x="1"
                                        y="1"
                                    />
                                    <rect
                                        fill="#7fba00"
                                        height="9"
                                        width="9"
                                        x="11"
                                        y="1"
                                    />
                                    <rect
                                        fill="#00a4ef"
                                        height="9"
                                        width="9"
                                        x="1"
                                        y="11"
                                    />
                                    <rect
                                        fill="#ffb900"
                                        height="9"
                                        width="9"
                                        x="11"
                                        y="11"
                                    />
                                </svg>
                                <span>Microsoft</span>
                            </button>
                        </div>

                        <p className="mt-2 text-center text-xs text-slate-500">
                            Don't have an account?
                            <Link
                                href="/register"
                                className="ml-1 font-bold text-indigo-600 hover:underline"
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
