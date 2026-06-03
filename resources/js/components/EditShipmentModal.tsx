import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';

interface Shipment {
    tracking_number: string;
    driver_id: number | null;
    origin_address: string;
    origin_city: string;
    origin_country: string;
    destination_address: string;
    destination_city: string;
    destination_country: string;
    description: string | null;
    weight: number | null;
    price: number | null;
    estimated_delivery: string | null;
}

interface Props {
    shipment: Shipment;
    onClose: () => void;
    drivers: { id: number; name: string }[];
}

export default function EditShipmentModal({
    shipment,
    onClose,
    drivers,
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        driver_id: shipment.driver_id ?? '',
        origin_address: shipment.origin_address,
        origin_city: shipment.origin_city,
        origin_country: shipment.origin_country,
        destination_address: shipment.destination_address,
        destination_city: shipment.destination_city,
        destination_country: shipment.destination_country,
        description: shipment.description ?? '',
        weight: shipment.weight ?? '',
        price: shipment.price ?? '',
        estimated_delivery: shipment.estimated_delivery?.split('T')[0] ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/shipments/${shipment.tracking_number}`, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                    <h3 className="text-sm font-bold text-slate-900">
                        Edit Shipment
                    </h3>
                    <button
                        onClick={onClose}
                        className="cursor-pointer rounded-xl p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={submit}
                    className="max-h-[75vh] space-y-4 overflow-y-auto p-6"
                >
                    {/* Driver ID */}
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
                            <option value="">Unassigned</option>
                            {drivers.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
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
                                    setData('origin_address', e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                                required
                            />
                            {errors.origin_address && (
                                <p className="mt-1 text-[10px] text-red-500">
                                    {errors.origin_address}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                Origin City
                            </label>
                            <input
                                type="text"
                                value={data.origin_city}
                                onChange={(e) =>
                                    setData('origin_city', e.target.value)
                                }
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
                                setData('origin_country', e.target.value)
                            }
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
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                                required
                            />
                            {errors.destination_address && (
                                <p className="mt-1 text-[10px] text-red-500">
                                    {errors.destination_address}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                Destination City
                            </label>
                            <input
                                type="text"
                                value={data.destination_city}
                                onChange={(e) =>
                                    setData('destination_city', e.target.value)
                                }
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
                                setData('destination_country', e.target.value)
                            }
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
                                style={{ colorScheme: 'light' }}
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
                            onClick={onClose}
                            className="cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
