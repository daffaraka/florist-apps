import React from 'react';
import { Sparkles, Eye, EyeOff, Edit3, Trash2, PackageOpen, Flower } from 'lucide-react';
import { BouquetItem } from '../types';

interface BouquetCatalogTableProps {
    bouquets: BouquetItem[];
    onEdit: (bouquet: BouquetItem) => void;
    onDelete: (bouquet: BouquetItem) => void;
    onToggle: (bouquet: BouquetItem, field: 'is_active' | 'is_ready_stock' | 'is_featured') => void;
}

export default function BouquetCatalogTable({
    bouquets,
    onEdit,
    onDelete,
    onToggle,
}: BouquetCatalogTableProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val || 0);
    };

    if (bouquets.length === 0) {
        return (
            <div className="bg-white border border-doff-border rounded-2xl p-12 text-center text-doff-muted">
                <PackageOpen className="w-12 h-12 stroke-1 mx-auto mb-3 text-doff-muted/60" />
                <p className="text-xs">Tidak ada data buket yang tersedia.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-doff-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-doff-sand/60 text-doff-muted border-b border-doff-border uppercase tracking-wider text-[11px] font-semibold">
                        <tr>
                            <th className="py-3 px-4">Buket</th>
                            <th className="py-3 px-4">Harga Jual</th>
                            <th className="py-3 px-4">HPP (Modal)</th>
                            <th className="py-3 px-4">Estimasi Laba</th>
                            <th className="py-3 px-4">Stok</th>
                            <th className="py-3 px-4">Unggulan</th>
                            <th className="py-3 px-4">Visibilitas</th>
                            <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-doff-border text-doff-charcoal">
                        {bouquets.map((b) => {
                            const profit = b.selling_price - b.estimated_cogs;
                            return (
                                <tr key={b.id} className="hover:bg-doff-sand/30 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            {b.photo_url ? (
                                                <img
                                                    src={b.photo_url}
                                                    alt={b.title}
                                                    className="w-10 h-10 rounded-lg object-cover border border-doff-border flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-doff-sand flex items-center justify-center text-doff-muted border border-doff-border flex-shrink-0">
                                                    <Flower className="w-5 h-5 stroke-1" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-doff-charcoal line-clamp-1">
                                                    {b.title}
                                                </p>
                                                <div className="flex gap-1 mt-0.5">
                                                    {b.occasions.slice(0, 2).map((occ) => (
                                                        <span
                                                            key={occ.id}
                                                            className="text-[9px] bg-doff-sand px-1.5 py-0.5 rounded"
                                                        >
                                                            {occ.emoji} {occ.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 font-semibold">
                                        {formatCurrency(b.selling_price)}
                                    </td>
                                    <td className="py-3 px-4 text-terracotta-600 font-medium">
                                        {formatCurrency(b.estimated_cogs)}
                                    </td>
                                    <td className="py-3 px-4 font-semibold text-sage-700">
                                        {formatCurrency(profit)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            type="button"
                                            onClick={() => onToggle(b, 'is_ready_stock')}
                                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                                                b.is_ready_stock
                                                    ? 'bg-sage-50 text-sage-800 border-sage-200'
                                                    : 'bg-blush-50 text-blush-600 border-blush-200'
                                            }`}
                                        >
                                            {b.is_ready_stock ? 'Ready Stock' : 'Pre-Order'}
                                        </button>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            type="button"
                                            onClick={() => onToggle(b, 'is_featured')}
                                            className={`p-1.5 rounded-full transition-colors ${
                                                b.is_featured
                                                    ? 'bg-terracotta-500 text-white'
                                                    : 'bg-doff-sand text-doff-muted hover:text-terracotta-500'
                                            }`}
                                        >
                                            <Sparkles className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            type="button"
                                            onClick={() => onToggle(b, 'is_active')}
                                            className={`p-1.5 rounded-full transition-colors ${
                                                b.is_active
                                                    ? 'bg-sage-100 text-sage-700'
                                                    : 'bg-doff-sand text-doff-muted'
                                            }`}
                                        >
                                            {b.is_active ? (
                                                <Eye className="w-3.5 h-3.5" />
                                            ) : (
                                                <EyeOff className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(b)}
                                                className="p-1 rounded text-doff-muted hover:text-sage-700 hover:bg-sage-50"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete(b)}
                                                className="p-1 rounded text-doff-muted hover:text-blush-600 hover:bg-blush-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
