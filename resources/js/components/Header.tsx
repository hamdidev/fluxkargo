import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Search, Bell, HelpCircle, Plus, X, Ship } from 'lucide-react';

interface Props {
    onSearchChange?: (query: string) => void;
    setIsMobileMenuOpen: (open: boolean) => void;
}

interface PageProps {
    auth: { user: { role: string; company_id: number } };
    customers: { id: number; name: string; email: string }[];
    drivers: { id: number; name: string }[];
}

export default function Header({ onSearchChange, setIsMobileMenuOpen }: Props) {
    const { auth, modal_data } = usePage<PageProps>().props;
    const customers = modal_data?.customers ?? [];
    const drivers = modal_data?.drivers ?? [];

    const canCreateShipment = ['super_admin', 'company_admin'].includes(
        auth.user.role,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_id: '',
        driver_id: '',
        origin_address: '',
        origin_city: '',
        origin_country: '',
        destination_address: '',
        destination_city: '',
        destination_country: '',
        weight: '',
        price: '',
        description: '',
        estimated_delivery: '',
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        if (onSearchChange) {
            onSearchChange(query);
        } else {
            router.get(
                window.location.pathname,
                { search: query },
                { preserveState: true, replace: true },
            );
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/shipments', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };
    useEffect(() => {
        const handler = () => setIsModalOpen(true);
        window.addEventListener('open-shipment-modal', handler);
        return () => window.removeEventListener('open-shipment-modal', handler);
    }, []);

    return (
        <>
            <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white px-8">
                {/* Mobile toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="mr-3 rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                {/* Search */}
                <div className="relative max-w-sm flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        onChange={handleSearch}
                        type="text"
                        placeholder="Search shipments, companies, or destinations..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-xs text-slate-800 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                    />
                </div>

                {/* Right */}
                <div className="flex items-center gap-4">
                    <button className="relative rounded-full p-2 text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-800">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
                    </button>
                    <button className="hidden rounded-full p-2 text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-800 sm:block">
                        <HelpCircle className="h-5 w-5" />
                    </button>
                    <div className="hidden h-6 w-px bg-slate-200 sm:block" />
                    {canCreateShipment && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98]"
                        >
                            <Plus className="h-4 w-4" />
                            <span>New Shipment</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
                        {/* Modal header */}
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600">
                                    <Ship className="h-4 w-4" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    Create New Shipment
                                </h3>
                            </div>
                            <button
                                onClick={closeModal}
                                className="cursor-pointer rounded-xl p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="max-h-[75vh] space-y-4 overflow-y-auto p-6"
                        >
                            {/* Customer & Driver */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                        Customer
                                    </label>
                                    <select
                                        value={data.customer_id}
                                        onChange={(e) =>
                                            setData(
                                                'customer_id',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                                        required
                                    >
                                        <option value="">
                                            Select customer
                                        </option>
                                        {customers.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} ({c.email})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.customer_id && (
                                        <p className="mt-1 text-[10px] text-red-500">
                                            {errors.customer_id}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                        Driver (optional)
                                    </label>
                                    <select
                                        value={data.driver_id}
                                        onChange={(e) =>
                                            setData('driver_id', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                                    >
                                        <option value="">Assign later</option>
                                        {drivers.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Origin */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                        Origin Address
                                    </label>
                                    <input
                                        type="text"
                                        value={data.origin_address}
                                        onChange={(e) =>
                                            setData(
                                                'origin_address',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="123 Depot St"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                        Origin City
                                    </label>
                                    <input
                                        type="text"
                                        value={data.origin_city}
                                        onChange={(e) =>
                                            setData(
                                                'origin_city',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Chicago"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                    Origin Country
                                </label>
                                <input
                                    type="text"
                                    value={data.origin_country}
                                    onChange={(e) =>
                                        setData(
                                            'origin_country',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="USA"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Destination */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                        Destination Address
                                    </label>
                                    <input
                                        type="text"
                                        value={data.destination_address}
                                        onChange={(e) =>
                                            setData(
                                                'destination_address',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="456 Terminal Ave"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                        Destination City
                                    </label>
                                    <input
                                        type="text"
                                        value={data.destination_city}
                                        onChange={(e) =>
                                            setData(
                                                'destination_city',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Boston"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                    Destination Country
                                </label>
                                <input
                                    type="text"
                                    value={data.destination_country}
                                    onChange={(e) =>
                                        setData(
                                            'destination_country',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="USA"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Weight, Price, ETA */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.weight}
                                        onChange={(e) =>
                                            setData('weight', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                        Price (€)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData('price', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                        Est. Delivery
                                    </label>
                                    <input
                                        type="date"
                                        value={data.estimated_delivery}
                                        onChange={(e) =>
                                            setData(
                                                'estimated_delivery',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={2}
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                                />
                            </div>

                            {/* Footer */}
                            <div className="border-slate-150 flex justify-end gap-3 border-t pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-60"
                                >
                                    {processing
                                        ? 'Creating...'
                                        : 'Confirm Shipment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
