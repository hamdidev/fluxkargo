import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    Activity,
    ArrowRight,
    BarChart3,
    Bell,
    CheckCircle2,
    ChevronRight,
    Clock,
    Globe2,
    MapPin,
    Menu,
    Package,
    Route,
    ShieldCheck,
    Truck,
    Users,
    X,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';

interface PageProps {
    auth: { user: { name: string } | null };
    [key: string]: unknown;
}

const NAV_LINKS = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Customers', href: '#customers' },
];

const FEATURES = [
    {
        icon: MapPin,
        title: 'Live GPS Tracking',
        description:
            'Watch every shipment move across the map in real time. Drivers stream their location and customers always know where their freight is.',
    },
    {
        icon: Route,
        title: 'Smart Route Visibility',
        description:
            'Origin-to-destination routes rendered on an interactive map with ETAs that update as conditions change on the road.',
    },
    {
        icon: Truck,
        title: 'Fleet & Driver Management',
        description:
            'Assign drivers, balance loads and monitor your entire fleet from one operations dashboard built for dispatchers.',
    },
    {
        icon: Bell,
        title: 'Instant Status Alerts',
        description:
            'Picked up, in transit, delivered. State changes push to everyone involved the moment they happen — no refresh required.',
    },
    {
        icon: Users,
        title: 'Role-Based Access',
        description:
            'Super admins, companies, drivers and customers each get a tailored view with exactly the controls they need.',
    },
    {
        icon: BarChart3,
        title: 'Operations Analytics',
        description:
            'Delivery performance, on-time rates and volume trends surfaced as clear, actionable insight for your team.',
    },
];

const STEPS = [
    {
        icon: Package,
        title: 'Create a shipment',
        description:
            'Log origin, destination, weight and value in seconds. Assign a driver now or later.',
    },
    {
        icon: Activity,
        title: 'Track in real time',
        description:
            'Drivers go live and the shipment streams its position to the map automatically.',
    },
    {
        icon: CheckCircle2,
        title: 'Deliver with proof',
        description:
            'Status transitions are logged end to end, giving you a complete, auditable delivery trail.',
    },
];

const STATS = [
    { value: '99.9%', label: 'Tracking uptime' },
    { value: '2.4M+', label: 'Shipments tracked' },
    { value: '<3s', label: 'Location refresh' },
    { value: '120+', label: 'Countries served' },
];

const PLANS = [
    {
        name: 'Starter',
        price: '$0',
        cadence: '/ month',
        description: 'For small teams getting their first fleet online.',
        features: [
            'Up to 5 drivers',
            'Live map tracking',
            'Email alerts',
            'Community support',
        ],
        cta: 'Start free',
        highlighted: false,
    },
    {
        name: 'Growth',
        price: '$49',
        cadence: '/ month',
        description: 'For growing logistics operations that need full control.',
        features: [
            'Unlimited drivers',
            'Real-time status alerts',
            'Operations analytics',
            'Role-based access',
            'Priority support',
        ],
        cta: 'Start 14-day trial',
        highlighted: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        cadence: '',
        description: 'For large carriers with advanced security needs.',
        features: [
            'SSO & audit logs',
            'Dedicated infrastructure',
            'Custom integrations',
            'SLA & onboarding',
        ],
        cta: 'Contact sales',
        highlighted: false,
    },
];

const TESTIMONIALS = [
    {
        quote: 'FluxKargo replaced three spreadsheets and a group chat. Our dispatchers finally see the whole fleet on one screen.',
        name: 'Marta Köhler',
        role: 'Head of Operations, NordFreight',
    },
    {
        quote: 'Customers stopped calling to ask “where’s my delivery?”. They just open the tracking link and watch it move.',
        name: 'Daniel Owusu',
        role: 'Founder, SwiftHaul Logistics',
    },
    {
        quote: 'Onboarding drivers took an afternoon. The live location accuracy is genuinely better than tools costing 5x more.',
        name: 'Priya Nair',
        role: 'Fleet Manager, Meridian Cargo',
    },
];

function Logo({ className = '' }: { className?: string }) {
    return (
        <span className={`flex items-center gap-2 ${className}`}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/30">
                <Truck className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
                Flux<span className="text-blue-600">Kargo</span>
            </span>
        </span>
    );
}

export default function Welcome() {
    const { auth } = usePage<PageProps>().props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const sceneRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <Head title="FluxKargo — Real-time cargo & shipment tracking">
                <meta
                    name="description"
                    content="FluxKargo is the real-time logistics platform for tracking shipments, managing fleets and keeping customers informed from pickup to delivery."
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin=""
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div
                className="min-h-screen scroll-smooth bg-white text-slate-700 antialiased"
                style={{
                    fontFamily:
                        "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
                }}
            >
                {/* ---------- Navbar ---------- */}
                <header
                    className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
                        scrolled
                            ? 'border-b border-slate-200/80 bg-white/85 backdrop-blur-md'
                            : 'border-b border-transparent bg-transparent'
                    }`}
                >
                    <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/" aria-label="FluxKargo home">
                            <Logo />
                        </Link>

                        <div className="hidden items-center gap-8 lg:flex">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-blue-600"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        <div className="hidden items-center gap-3 lg:flex">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 active:scale-[0.98]"
                                >
                                    Dashboard
                                    <ArrowRight
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-blue-600"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
                                    >
                                        Get started
                                        <ArrowRight
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setMobileOpen((v) => !v)}
                            className="inline-flex cursor-pointer items-center justify-center rounded-xl p-2 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </nav>

                    {mobileOpen && (
                        <div className="border-t border-slate-200 bg-white px-4 pt-2 pb-6 lg:hidden">
                            <div className="flex flex-col gap-1">
                                {NAV_LINKS.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                            <div className="mt-4 flex flex-col gap-2">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white"
                                        >
                                            Get started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                {/* ---------- Hero ---------- */}
                <section className="relative overflow-hidden pt-16">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 via-white to-white"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] bg-[size:44px_44px]"
                    />

                    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-28">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75 motion-reduce:animate-none" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                                </span>
                                Live tracking, on every shipment
                            </span>

                            <h1 className="mt-6 text-4xl leading-[1.1] font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                                Know where your cargo is.{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                                    Every second.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                                FluxKargo turns scattered phone calls and
                                spreadsheets into one live operations hub —
                                real-time GPS tracking, fleet management and
                                instant delivery updates for shippers, drivers
                                and customers alike.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={auth.user ? dashboard() : register()}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-200 hover:bg-orange-600 active:scale-[0.98]"
                                >
                                    {auth.user
                                        ? 'Go to dashboard'
                                        : 'Start tracking free'}
                                    <ArrowRight
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-base font-semibold text-slate-800 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
                                >
                                    See how it works
                                </a>
                            </div>

                            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                                <span className="inline-flex items-center gap-1.5">
                                    <CheckCircle2
                                        className="h-4 w-4 text-green-500"
                                        aria-hidden="true"
                                    />
                                    No credit card required
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <CheckCircle2
                                        className="h-4 w-4 text-green-500"
                                        aria-hidden="true"
                                    />
                                    Live in minutes
                                </span>
                            </div>
                        </div>

                        {/* Live tracking visual */}
                        <div ref={sceneRef} className="relative">
                            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-blue-900/10">
                                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full bg-red-400" />
                                        <span className="h-3 w-3 rounded-full bg-amber-400" />
                                        <span className="h-3 w-3 rounded-full bg-green-400" />
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                        <Activity
                                            className="h-3.5 w-3.5 text-blue-600"
                                            aria-hidden="true"
                                        />
                                        Live operations
                                    </span>
                                </div>

                                {/* faux map */}
                                <div className="relative h-72 bg-[radial-gradient(circle_at_30%_20%,#dbeafe,transparent_55%),radial-gradient(circle_at_80%_70%,#e0e7ff,transparent_50%)]">
                                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:32px_32px]" />

                                    <svg
                                        className="absolute inset-0 h-full w-full"
                                        viewBox="0 0 400 288"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M60 220 C 140 180, 160 90, 250 90 S 350 70, 350 60"
                                            stroke="#2563EB"
                                            strokeWidth="3"
                                            strokeDasharray="2 10"
                                            strokeLinecap="round"
                                            fill="none"
                                        />
                                    </svg>

                                    {/* origin */}
                                    <div className="absolute top-[75%] left-[14%] -translate-y-1/2">
                                        <span className="flex h-3 w-3 rounded-full bg-slate-400 ring-4 ring-slate-200" />
                                    </div>
                                    {/* moving truck */}
                                    <div className="absolute top-[28%] left-[58%] -translate-x-1/2 -translate-y-1/2">
                                        <span className="absolute -inset-3 animate-ping rounded-full bg-blue-500/30 motion-reduce:animate-none" />
                                        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/40">
                                            <Truck
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </div>
                                    {/* destination */}
                                    <div className="absolute top-[18%] right-[10%]">
                                        <MapPin
                                            className="h-6 w-6 fill-orange-100 text-orange-500"
                                            aria-hidden="true"
                                        />
                                    </div>

                                    {/* floating status card */}
                                    <div className="absolute right-4 bottom-4 left-4 rounded-2xl border border-slate-100 bg-white/95 p-3.5 shadow-lg backdrop-blur">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                    <Package
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">
                                                        #FK-20418
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        Hamburg → Rotterdam
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500 motion-reduce:animate-none" />
                                                In transit
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* floating ETA chip */}
                            <div className="absolute -top-3 -right-3 hidden rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-xl sm:block">
                                <div className="flex items-center gap-2">
                                    <Clock
                                        className="h-4 w-4 text-blue-600"
                                        aria-hidden="true"
                                    />
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            ETA
                                        </p>
                                        <p className="text-sm font-bold text-slate-900">
                                            2h 14m
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* stats bar */}
                    <div className="border-y border-slate-100 bg-slate-50/60">
                        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
                            {STATS.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="px-4 py-8 text-center"
                                >
                                    <p className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                                        {stat.value}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ---------- Features ---------- */}
                <section
                    id="features"
                    className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8"
                >
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="text-sm font-bold tracking-widest text-blue-600 uppercase">
                            Features
                        </span>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Everything you need to move freight with confidence
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            One platform connecting dispatchers, drivers and
                            customers — with live data at the center of every
                            decision.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map((feature) => (
                            <div
                                key={feature.title}
                                className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
                            >
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white">
                                    <feature.icon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </span>
                                <h3 className="mt-5 text-lg font-bold text-slate-900">
                                    {feature.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ---------- How it works ---------- */}
                <section
                    id="how-it-works"
                    className="scroll-mt-20 bg-slate-50 py-24"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <span className="text-sm font-bold tracking-widest text-blue-600 uppercase">
                                How it works
                            </span>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                                From booking to delivery in three steps
                            </h2>
                        </div>

                        <div className="relative mt-16 grid gap-8 lg:grid-cols-3">
                            <div
                                aria-hidden="true"
                                className="absolute top-7 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent lg:block"
                            />
                            {STEPS.map((step, index) => (
                                <div
                                    key={step.title}
                                    className="relative text-center"
                                >
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-sm">
                                        <step.icon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <span className="mt-4 inline-block text-xs font-bold tracking-widest text-slate-400 uppercase">
                                        Step {index + 1}
                                    </span>
                                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                                        {step.title}
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ---------- Customers / testimonials ---------- */}
                <section
                    id="customers"
                    className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8"
                >
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="text-sm font-bold tracking-widest text-blue-600 uppercase">
                            Customers
                        </span>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Logistics teams run on FluxKargo
                        </h2>
                    </div>

                    <div className="mt-16 grid gap-6 lg:grid-cols-3">
                        {TESTIMONIALS.map((t) => (
                            <figure
                                key={t.name}
                                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
                            >
                                <blockquote className="flex-1 text-base leading-relaxed text-slate-700">
                                    “{t.quote}”
                                </blockquote>
                                <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                        {t.name.charAt(0)}
                                    </span>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">
                                            {t.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {t.role}
                                        </p>
                                    </div>
                                </figcaption>
                            </figure>
                        ))}
                    </div>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-semibold text-slate-400">
                        <span className="inline-flex items-center gap-2">
                            <ShieldCheck
                                className="h-5 w-5"
                                aria-hidden="true"
                            />{' '}
                            SOC 2 ready
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <Globe2 className="h-5 w-5" aria-hidden="true" />{' '}
                            GDPR compliant
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <Activity className="h-5 w-5" aria-hidden="true" />{' '}
                            99.9% uptime SLA
                        </span>
                    </div>
                </section>

                {/* ---------- Pricing ---------- */}
                <section
                    id="pricing"
                    className="scroll-mt-20 bg-slate-50 py-24"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <span className="text-sm font-bold tracking-widest text-blue-600 uppercase">
                                Pricing
                            </span>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                                Simple pricing that scales with your fleet
                            </h2>
                            <p className="mt-4 text-lg text-slate-600">
                                Start free, upgrade when you grow. No hidden
                                fees, cancel anytime.
                            </p>
                        </div>

                        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
                            {PLANS.map((plan) => (
                                <div
                                    key={plan.name}
                                    className={`relative flex flex-col rounded-3xl border p-8 ${
                                        plan.highlighted
                                            ? 'border-blue-600 bg-white shadow-2xl shadow-blue-900/10 lg:-mt-4 lg:mb-4'
                                            : 'border-slate-200 bg-white'
                                    }`}
                                >
                                    {plan.highlighted && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
                                            Most popular
                                        </span>
                                    )}
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {plan.name}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-500">
                                        {plan.description}
                                    </p>
                                    <div className="mt-5 flex items-baseline gap-1">
                                        <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                                            {plan.price}
                                        </span>
                                        {plan.cadence && (
                                            <span className="text-sm font-medium text-slate-500">
                                                {plan.cadence}
                                            </span>
                                        )}
                                    </div>

                                    <ul className="mt-6 flex-1 space-y-3">
                                        {plan.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-center gap-2.5 text-sm text-slate-700"
                                            >
                                                <CheckCircle2
                                                    className="h-5 w-5 flex-shrink-0 text-blue-600"
                                                    aria-hidden="true"
                                                />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href={
                                            auth.user ? dashboard() : register()
                                        }
                                        className={`mt-8 inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                                            plan.highlighted
                                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25 hover:bg-blue-700'
                                                : 'border border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        {plan.cta}
                                        <ChevronRight
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ---------- Final CTA ---------- */}
                <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 text-center sm:px-12">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-600/30 blur-3xl"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl"
                        />
                        <div className="relative">
                            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                Put your whole fleet on the map today
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
                                Join the logistics teams tracking every shipment
                                in real time with FluxKargo. Set up takes
                                minutes.
                            </p>
                            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                                <Link
                                    href={auth.user ? dashboard() : register()}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-200 hover:bg-orange-600 active:scale-[0.98]"
                                >
                                    {auth.user
                                        ? 'Go to dashboard'
                                        : 'Start tracking free'}
                                    <ArrowRight
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </Link>
                                {!auth.user && (
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10"
                                    >
                                        Log in
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ---------- Footer ---------- */}
                <footer className="border-t border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                            <Logo />
                            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
                                {NAV_LINKS.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="transition-colors duration-200 hover:text-blue-600"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-400">
                            © {new Date().getFullYear()} FluxKargo. Real-time
                            cargo & shipment tracking.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
