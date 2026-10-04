import React from 'react';
import { Sparkles, Eye, EyeOff, Edit3, Trash2, Flower } from 'lucide-react';
import { BouquetItem } from '../types';

interface BouquetCatalogItemCardProps {
    bouquet: BouquetItem;
    onEdit: (bouquet: BouquetItem) => void;
    onDelete: (bouquet: BouquetItem) => void;
    onToggle: (bouquet: BouquetItem, field: 'is_active' | 'is_ready_stock' | 'is_featured') => void;
}

export default function BouquetCatalogItemCard({
    bouquet,
    onEdit,
    onDelete,
    onToggle,
}: BouquetCatalogItemCardProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val || 0);
    };

    return (
        <div className="bg-white border border-doff-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            {/* Image & Quick Badges */}
            <div className="relative aspect-[4/3] bg-doff-sand/50 overflow-hidden">
                {bouquet.photo_url ? (
                    <img
                        src={bouquet.photo_url}
                        alt={bouquet.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-doff-muted/60">
                        <Flower className="w-12 h-12 stroke-1 mb-1" />
                        <span className="text-[11px]">Belum ada foto</span>
                    </div>
                )}

                {/* Featured Badge Button */}
                <button
                    type="button"
                    onClick={() => onToggle(bouquet, 'is_featured')}
                    title={bouquet.is_featured ? 'Hapus dari Unggulan' : 'Jadikan Unggulan (Maks 3)'}
                    className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-colors shadow-sm ${
                        bouquet.is_featured
                            ? 'bg-terracotta-500 text-white'
                            : 'bg-white/80 text-doff-muted hover:text-terracotta-500 hover:bg-white'
                    }`}
                >
                    <Sparkles className="w-3.5 h-3.5" />
                </button>

                {/* Stock Badge Button */}
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => onToggle(bouquet, 'is_ready_stock')}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-md transition-colors shadow-sm ${
                            bouquet.is_ready_stock
                                ? 'bg-sage-50/90 text-sage-800 border-sage-300'
                                : 'bg-blush-50/90 text-blush-600 border-blush-200'
                        }`}
                    >
                        {bouquet.is_ready_stock ? 'Ready Stock' : 'Pre-Order'}
                    </button>
                </div>

                {/* Visibility Badge */}
                <button
                    type="button"
                    onClick={() => onToggle(bouquet, 'is_active')}
                    title={bouquet.is_active ? 'Sembunyikan dari Toko' : 'Tampilkan di Toko'}
                    className={`absolute top-2.5 left-2.5 p-1.5 rounded-full backdrop-blur-md transition-colors shadow-sm ${
                        bouquet.is_active
                            ? 'bg-white/90 text-sage-700'
                            : 'bg-doff-dark/80 text-white'
                    }`}
                >
                    {bouquet.is_active ? (
                        <Eye className="w-3.5 h-3.5" />
                    ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                    )}
                </button>
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    {/* Occasion Tags */}
                    {bouquet.occasions && bouquet.occasions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1.5">
                            {bouquet.occasions.slice(0, 2).map((occ) => (
                                <span
                                    key={occ.id}
                                    className="text-[10px] bg-doff-sand text-doff-charcoal px-2 py-0.5 rounded-md"
                                >
                                    {occ.emoji} {occ.name}
                                </span>
                            ))}
                            {bouquet.occasions.length > 2 && (
                                <span className="text-[10px] text-doff-muted self-center">
                                    +{bouquet.occasions.length - 2}
                                </span>
                            )}
                        </div>
                    )}

                    <h4 className="font-bold text-doff-charcoal text-sm line-clamp-1 mb-1">
                        {bouquet.title}
                    </h4>

                    {/* Price & COGS */}
                    <div className="flex items-baseline justify-between mt-2">
                        <div>
                            <span className="text-[10px] text-doff-muted block">Harga Jual</span>
                            <span className="font-bold text-doff-charcoal text-base">
                                {formatCurrency(bouquet.selling_price)}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-doff-muted block">HPP (Modal)</span>
                            <span className="text-xs font-semibold text-terracotta-600">
                                {formatCurrency(bouquet.estimated_cogs)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-doff-border">
                    <span className="text-[11px] text-doff-muted">
                        {bouquet.compositions?.length || 0} bahan penyusun
                    </span>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => onEdit(bouquet)}
                            className="p-1.5 rounded-lg text-doff-muted hover:text-sage-700 hover:bg-sage-50 transition-colors"
                            title="Edit Buket"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(bouquet)}
                            className="p-1.5 rounded-lg text-doff-muted hover:text-blush-600 hover:bg-blush-50 transition-colors"
                            title="Hapus Buket"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
