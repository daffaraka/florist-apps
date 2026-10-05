import React from 'react';
import { useForm } from '@inertiajs/react';
import { X, Plus } from 'lucide-react';
import { InventoryCategory, ItemCategory, UnitMeasurement } from '../types';
import QuickAddMasterDataModal from '../../master-data/components/QuickAddMasterDataModal';

interface InventoryCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories?: ItemCategory[];
    units?: UnitMeasurement[];
}

export default function InventoryCreateModal({
    isOpen,
    onClose,
    categories: initialCategories = [],
    units: initialUnits = [],
}: InventoryCreateModalProps) {
    if (!isOpen) return null;

    const [categoriesList, setCategoriesList] = React.useState<ItemCategory[]>(initialCategories);
    const [unitsList, setUnitsList] = React.useState<UnitMeasurement[]>(initialUnits);
    const [quickModal, setQuickModal] = React.useState<'category' | 'unit' | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        sku: '',
        barcode: '',
        category: initialCategories[0]?.slug || 'fresh_flower',
        category_id: initialCategories[0]?.id || '',
        color: '',
        unit_cost: '',
        stock_quantity: '',
        unit_measurement: initialUnits[0]?.symbol || 'stem',
        unit_measurement_id: initialUnits[0]?.id || '',
        shelf_life_days: '5',
        minimum_alert_stock: '10',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/inventory', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full border border-doff-border shadow-xl p-6">
                <div className="flex items-center justify-between pb-3 border-b border-doff-border">
                    <div className="flex items-center space-x-2 text-sage-700">
                        <Plus className="w-5 h-5 stroke-[2]" />
                        <h3 className="font-semibold text-base text-doff-charcoal">Tambah Bahan Baru</h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg text-doff-muted hover:bg-doff-sand">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
                    {/* Nama Bahan */}
                    <div>
                        <label className="block font-medium text-doff-charcoal mb-1">Nama Bahan / Bunga *</label>
                        <input
                            type="text"
                            placeholder="Contoh: Mawar Ecuador Putih, Pita Satin Peach"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full text-sm rounded-xl border border-doff-border px-3.5 py-2"
                            required
                        />
                        {errors.name && <p className="text-[11px] text-terracotta-600 mt-0.5">{errors.name}</p>}
                    </div>

                    {/* Kategori & Satuan */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block font-medium text-doff-charcoal">Kategori *</label>
                                <button
                                    type="button"
                                    onClick={() => setQuickModal('category')}
                                    className="inline-flex items-center space-x-0.5 text-[10px] font-medium text-sage-700 hover:text-sage-800 bg-sage-50 px-1.5 py-0.5 rounded border border-sage-200 transition-colors"
                                >
                                    <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
                                    <span>Tambah</span>
                                </button>
                            </div>
                            <select
                                value={data.category_id || data.category}
                                onChange={(e) => {
                                    const selectedId = Number(e.target.value);
                                    const matched = categoriesList.find((c) => c.id === selectedId);
                                    if (matched) {
                                        setData((prev) => ({
                                            ...prev,
                                            category_id: matched.id,
                                            category: matched.slug as InventoryCategory,
                                        }));
                                    } else {
                                        setData((prev) => ({
                                            ...prev,
                                            category: e.target.value as InventoryCategory,
                                        }));
                                    }
                                }}
                                className="w-full text-xs rounded-xl border border-doff-border px-3 py-2 bg-white"
                            >
                                {categoriesList.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block font-medium text-doff-charcoal">Satuan *</label>
                                <button
                                    type="button"
                                    onClick={() => setQuickModal('unit')}
                                    className="inline-flex items-center space-x-0.5 text-[10px] font-medium text-sage-700 hover:text-sage-800 bg-sage-50 px-1.5 py-0.5 rounded border border-sage-200 transition-colors"
                                >
                                    <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
                                    <span>Tambah</span>
                                </button>
                            </div>
                            <select
                                value={data.unit_measurement_id || data.unit_measurement}
                                onChange={(e) => {
                                    const selectedId = Number(e.target.value);
                                    const matched = unitsList.find((u) => u.id === selectedId);
                                    if (matched) {
                                        setData((prev) => ({
                                            ...prev,
                                            unit_measurement_id: matched.id,
                                            unit_measurement: matched.symbol,
                                        }));
                                    } else {
                                        setData((prev) => ({
                                            ...prev,
                                            unit_measurement: e.target.value,
                                        }));
                                    }
                                }}
                                className="w-full text-xs rounded-xl border border-doff-border px-3 py-2 bg-white"
                            >
                                {unitsList.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name} ({unit.symbol})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Warna & SKU/Barcode */}
                    <div className="grid grid-cols-3 gap-2.5">
                        <div>
                            <label className="block font-medium text-doff-charcoal mb-1">Warna / Corak</label>
                            <input
                                type="text"
                                placeholder="Red, Pastel Sage"
                                value={data.color}
                                onChange={(e) => setData('color', e.target.value)}
                                className="w-full text-xs rounded-xl border border-doff-border px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-doff-charcoal mb-1">Kode SKU</label>
                            <input
                                type="text"
                                placeholder="FLW-ROSE-WHT"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                className="w-full text-xs rounded-xl border border-doff-border px-3 py-2 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-doff-charcoal mb-1">Kode Barcode</label>
                            <input
                                type="text"
                                placeholder="899123456"
                                value={data.barcode}
                                onChange={(e) => setData('barcode', e.target.value)}
                                className="w-full text-xs rounded-xl border border-doff-border px-3 py-2 font-mono"
                            />
                        </div>
                    </div>

                    {/* Harga Modal, Stok & Alert */}
                    <div className="grid grid-cols-3 gap-2.5">
                        <div>
                            <label className="block font-medium text-doff-charcoal mb-1">Harga Modal (Rp) *</label>
                            <input
                                type="number"
                                min="0"
                                placeholder="8000"
                                value={data.unit_cost}
                                onChange={(e) => setData('unit_cost', e.target.value)}
                                className="w-full text-xs rounded-xl border border-doff-border px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-doff-charcoal mb-1">Stok Awal *</label>
                            <input
                                type="number"
                                min="0"
                                placeholder="50"
                                value={data.stock_quantity}
                                onChange={(e) => setData('stock_quantity', e.target.value)}
                                className="w-full text-xs rounded-xl border border-doff-border px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-doff-charcoal mb-1">Batas Min Alert *</label>
                            <input
                                type="number"
                                min="1"
                                value={data.minimum_alert_stock}
                                onChange={(e) => setData('minimum_alert_stock', e.target.value)}
                                className="w-full text-xs rounded-xl border border-doff-border px-3 py-2"
                                required
                            />
                        </div>
                    </div>

                    {/* Masa Kesegaran (Khusus Bunga Segar) */}
                    {data.category === 'fresh_flower' && (
                        <div>
                            <label className="block font-medium text-doff-charcoal mb-1">Masa Kesegaran (Hari)</label>
                            <input
                                type="number"
                                min="1"
                                placeholder="5"
                                value={data.shelf_life_days}
                                onChange={(e) => setData('shelf_life_days', e.target.value)}
                                className="w-full text-xs rounded-xl border border-doff-border px-3 py-2"
                            />
                            <p className="text-[10px] text-doff-muted mt-0.5">Estimasi lama bunga tetap segar di workshop/chiller</p>
                        </div>
                    )}

                    <div className="flex items-center justify-end space-x-2 pt-3 border-t border-doff-border/60">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-doff-charcoal bg-white hover:bg-doff-sand border border-doff-border shadow-xs hover:border-doff-muted/40 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 rounded-xl font-semibold bg-sage-600 text-white hover:bg-sage-700 shadow-xs"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Bahan'}
                        </button>
                    </div>
                </form>

                {/* Inline Quick Add Modal */}
                <QuickAddMasterDataModal
                    isOpen={quickModal !== null}
                    type={quickModal || 'category'}
                    onClose={() => setQuickModal(null)}
                    onSuccessCategory={(newCat) => {
                        setCategoriesList((prev) => [...prev, newCat]);
                        setData((prev) => ({
                            ...prev,
                            category_id: newCat.id,
                            category: newCat.slug,
                        }));
                    }}
                    onSuccessUnit={(newUnit) => {
                        setUnitsList((prev) => [...prev, newUnit]);
                        setData((prev) => ({
                            ...prev,
                            unit_measurement_id: newUnit.id,
                            unit_measurement: newUnit.symbol,
                        }));
                    }}
                />
            </div>
        </div>
    );
}
