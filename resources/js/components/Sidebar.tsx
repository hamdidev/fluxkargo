import { Link, router, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Truck,
    Building2,
    Users,
    DollarSign,
    Settings,
    Smartphone,
    Globe,
    LogOut,
} from 'lucide-react';

interface Props {
    role: string;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
    currentUser: { name: string; email: string; companyName?: string };
}

const navByRole: Record<
    string,
    { href: string; label: string; icon: React.ElementType }[]
> = {
    super_admin: [
        { href: '/super/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/shipments', label: 'Shipments', icon: Truck },
        { href: '/super/users', label: 'Users', icon: Users },
    ],
    company_admin: [
        {
            href: '/company/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
        },
        { href: '/shipments', label: 'Shipments', icon: Truck },
        { href: '/company/team', label: 'Team', icon: Users },
        { href: '/company/billing', label: 'Billing', icon: DollarSign },
    ],
    dispatcher: [
        {
            href: '/dispatcher/dashboard',
            label: 'Dispatch Center',
            icon: LayoutDashboard,
        },
        { href: '/shipments', label: 'Shipments', icon: Truck },
    ],
    driver: [
        {
            href: '/driver/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
        },
        { href: '/shipments', label: 'My Routes', icon: Truck },
    ],
    customer: [
        {
            href: '/customer/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
        },
        { href: '/shipments', label: 'My Shipments', icon: Truck },
    ],
};

const dashboardByRole: Record<string, string> = {
    super_admin: '/super/dashboard',
    company_admin: '/company/dashboard',
    dispatcher: '/dispatcher/dashboard',
    driver: '/driver/dashboard',
    customer: '/customer/dashboard',
};

export default function Sidebar({
    role,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    currentUser,
}: Props) {
    const navItems = navByRole[role] ?? [];
    const page = usePage();
    const currentPath = new URL(
        page.url,
        typeof window !== 'undefined'
            ? window.location.origin
            : 'http://localhost',
    ).pathname;

    const logout = () => {
        router.post('/logout');
    };

    return (
        <>
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-50 flex h-screen w-[280px] flex-col border-r border-slate-200 bg-white py-6 text-slate-700 transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} `}
            >
                {/* Brand */}
                <div className="mb-8 px-6">
                    <Link
                        href={dashboardByRole[role] ?? '/'}
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
                            <div className="h-4 w-4 rotate-45 transform rounded-sm bg-white"></div>
                        </div>
                        <div>
                            <h1 className="text-lg leading-none font-bold tracking-tight text-slate-800">
                                FluxKargo
                            </h1>
                            <p className="mt-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                Logistics SaaS
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Nav */}
                <div className="flex-1 px-4">
                    <p className="mb-2 px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                        {role === 'driver'
                            ? 'Driver Menu'
                            : role === 'customer'
                              ? 'My Account'
                              : 'Operations'}
                    </p>
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive =
                                currentPath === item.href ||
                                currentPath.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-all ${
                                        isActive
                                            ? 'bg-indigo-50 font-semibold text-indigo-700'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                                >
                                    <Icon
                                        className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                                            isActive
                                                ? 'text-indigo-600'
                                                : 'text-slate-400'
                                        }`}
                                    />
                                    <span className="text-xs font-semibold tracking-wide">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom — user + logout */}
                <div className="border-slate-150 mt-4 border-t px-4 pt-4">
                    <div className="flex items-center gap-3 px-3">
                        <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                            <img
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                                alt={currentUser.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                                <p className="truncate text-xs leading-none font-bold text-slate-800">
                                    {currentUser.name}
                                </p>
                                <button
                                    onClick={logout}
                                    title="Logout"
                                    className="text-slate-400 transition-colors hover:text-red-500"
                                >
                                    <LogOut className="h-3.5 w-3.5" />
                                </button>
                            </div>
                            <p className="mt-1 truncate text-[10px] text-slate-400">
                                {currentUser.email}
                            </p>
                            {currentUser.companyName && (
                                <p className="mt-0.5 truncate text-[10px] text-indigo-500">
                                    {currentUser.companyName}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
