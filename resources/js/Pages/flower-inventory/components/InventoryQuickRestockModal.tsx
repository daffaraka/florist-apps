import React from 'react';
import { useForm } from '@inertiajs/react';
import { X, RefreshCw } from 'lucide-react';
import { InventoryItem } from '../types';

interface InventoryQuickRestockModalProps {
    item: InventoryItem | null;
    onClose: () => void;
}

export default function InventoryQuickRestockModal({
    item,
    onClose,
}: InventoryQuickRestockModalProps) {
    if (!item) return null;

    const { data, setData, put, processing, errors } = useForm({
        stock_quantity: String(item.stock_quantity),
        unit_cost: String(item.unit_cost),
        minimum_alert_stock: String(item.minimum_alert_stock),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/inventory/${item.id}`, {
            onSuccess: () => onClose(),
        });
    };

    const unitLabel = typeof item.unit_measurement === 'object' && item.unit_measurement !== null
        ? (item.unit_measurement as any).name || (item.unit_measurement as any).symbol || 'pcs'
        : item.unit?.name || item.unit?.symbol || item.unit_measurement || 'pcs';

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full border border-doff-border shadow-xl p-6">
                <div className="flex items-center justify-between pb-3 border-b border-doff-border">
                    <div className="flex items-center space-x-2 text-sage-700">
                        <RefreshCw className="w-4 h-4 stroke-[2]" />
                        <h3 className="font-semibold text-sm text-doff-charcoal">Restok / Update Bahan</h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg text-doff-muted hover:bg-doff-sand">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
                    <div>
                        <span className="font-semibold text-doff-charcoal block">{item.name}</span>
                        <span className="text-[11px] text-doff-muted">Satuan: {unitLabel}</span>
                    </div>

                    <div>
                        <label className="block font-medium text-doff-charcoal mb-1">
                            Jumlah Stok Fisik Terkini
                        </label>
                        <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={data.stock_quantity}
                            onChange={(e) => setData('stock_quantity', e.target.value)}
                            className="w-full text-sm rounded-xl border border-doff-border px-3 py-2"
                            required
                        />
                        {errors.stock_quantity && (
                            <p className="text-[10px] text-terracotta-600 mt-0.5">{errors.stock_quantity}</p>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium text-doff-charcoal mb-1">
                            Harga Beli / Modal Satuan (Rp)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={data.unit_cost}
                            onChange={(e) => setData('unit_cost', e.target.value)}
                            className="w-full text-sm rounded-xl border border-doff-border px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-doff-charcoal mb-1">
                            Batas Minimum Peringatan Stok
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={data.minimum_alert_stock}
                            onChange={(e) => setData('minimum_alert_stock', e.target.value)}
                            className="w-full text-sm rounded-xl border border-doff-border px-3 py-2"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-doff-border/60">
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
                            className="px-4 py-1.5 rounded-xl font-semibold bg-sage-600 text-white hover:bg-sage-700 shadow-xs"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
