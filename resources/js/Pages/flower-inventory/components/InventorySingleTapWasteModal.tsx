import React from 'react';
import { useForm } from '@inertiajs/react';
import { X, Flame, AlertCircle } from 'lucide-react';
import { InventoryItem, WasteReason } from '../types';

interface InventorySingleTapWasteModalProps {
    item: InventoryItem | null;
    onClose: () => void;
}

export default function InventorySingleTapWasteModal({
    item,
    onClose,
}: InventorySingleTapWasteModalProps) {
    if (!item) return null;

    const { data, setData, post, processing, errors, reset } = useForm({
        quantity_lost: '1',
        reason: 'wilted' as WasteReason,
        notes: '',
    });

    const quantityNum = Number(data.quantity_lost) || 0;
    const estimatedLoss = quantityNum * Number(item.unit_cost);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/inventory/${item.id}/waste`, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    const unitLabel = typeof item.unit_measurement === 'object' && item.unit_measurement !== null
        ? (item.unit_measurement as any).name || (item.unit_measurement as any).symbol || 'pcs'
        : item.unit?.name || item.unit?.symbol || item.unit_measurement || 'pcs';

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full border border-doff-border shadow-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-doff-border">
                    <div className="flex items-center space-x-2 text-terracotta-600">
                        <Flame className="w-5 h-5 stroke-[2]" />
                        <h3 className="font-semibold text-base text-doff-charcoal">Catat Bunga Rusak / Layu</h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg text-doff-muted hover:bg-doff-sand">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {/* Item info */}
                    <div className="bg-doff-sand/50 p-3.5 rounded-xl border border-doff-border/70 text-xs">
                        <p className="font-semibold text-doff-charcoal">{item.name}</p>
                        <p className="text-doff-muted mt-0.5">
                            Sisa stok saat ini: <strong className="text-doff-charcoal">{item.stock_quantity} {unitLabel}</strong>
                        </p>
                    </div>

                    {/* Kuantitas Layu / Rusak */}
                    <div>
                        <label className="block text-xs font-medium text-doff-charcoal mb-1">
                            Jumlah Rusak / Terbuang ({unitLabel})
                        </label>
                        <input
                            type="number"
                            step="0.5"
                            min="0.5"
                            max={item.stock_quantity}
                            value={data.quantity_lost}
                            onChange={(e) => setData('quantity_lost', e.target.value)}
                            className="w-full text-sm rounded-xl border border-doff-border px-3.5 py-2.5 focus:border-terracotta-500 focus:ring-0"
                            required
                        />
                        {errors.quantity_lost && (
                            <p className="text-[11px] text-terracotta-600 mt-1">{errors.quantity_lost}</p>
                        )}
                    </div>

                    {/* Alasan */}
                    <div>
                        <label className="block text-xs font-medium text-doff-charcoal mb-1">Penyebab Rusak</label>
                        <select
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value as WasteReason)}
                            className="w-full text-sm rounded-xl border border-doff-border px-3.5 py-2.5 focus:border-terracotta-500 focus:ring-0 bg-white"
                        >
                            <option value="wilted">Bunga Layu Alami</option>
                            <option value="broken_stem">Tangkai Patah Saat Merangkai</option>
                            <option value="pest">Hama / Daun Busuk</option>
                            <option value="damaged_packaging">Kertas / Kemasan Sobek</option>
                            <option value="expired">Kedaluwarsa Masa Kesegaran</option>
                            <option value="other">Lainnya</option>
                        </select>
                    </div>

                    {/* Catatan Singkat */}
                    <div>
                        <label className="block text-xs font-medium text-doff-charcoal mb-1">Catatan (Opsional)</label>
                        <input
                            type="text"
                            placeholder="Contoh: Terjepit saat unboxing dari suplier"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="w-full text-xs rounded-xl border border-doff-border px-3.5 py-2"
                        />
                    </div>

                    {/* Estimasi Kerugian Finansial Otomatis */}
                    <div className="bg-terracotta-50/60 p-3 rounded-xl border border-terracotta-200/80 flex items-center justify-between text-xs">
                        <span className="text-terracotta-700 font-medium">Estimasi Kerugian Aset:</span>
                        <span className="font-bold text-terracotta-800 text-sm">{formatCurrency(estimatedLoss)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-2 pt-2">
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
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-terracotta-500 text-white hover:bg-terracotta-600 transition-colors shadow-xs"
                        >
                            {processing ? 'Menyimpan...' : 'Potong Stok & Catat Rugi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
