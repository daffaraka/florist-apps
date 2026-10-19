import React from 'react';
import { Star, Zap, Clock, ArrowRight } from 'lucide-react';
import { StorefrontBouquet } from '../types';

interface StorefrontBouquetCardProps {
    bouquet: StorefrontBouquet;
    onSelectBouquet: (bouquet: StorefrontBouquet) => void;
    onQuickOrder: (bouquet: StorefrontBouquet) => void;
}

export default function StorefrontBouquetCard({
    bouquet,
    onSelectBouquet,
    onQuickOrder,
}: StorefrontBouquetCardProps) {
    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(bouquet.selling_price);

    return (
        <div className="group bg-white rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
            {/* Foto Buket & Badge */}
            <div
                className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden cursor-pointer"
                onClick={() => onSelectBouquet(bouquet)}
            >
                {bouquet.photo_url ? (
                    <img
                        src={bouquet.photo_url}
                        alt={bouquet.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-600 text-xs">
                        Foto tidak tersedia
                    </div>
                )}

                {/* Badge Ketersediaan */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {bouquet.is_ready_stock ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-emerald-800 shadow-xs backdrop-blur-xs">
                            <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                            <span>Ready Stock</span>
                        </span>
                    ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/95 text-stone-700 shadow-xs backdrop-blur-xs">
                            <Clock className="w-3 h-3 text-stone-600" />
                            <span>Pre-Order (PO)</span>
                        </span>
                    )}
                </div>

                {/* Micro Rating di Atas Foto */}
                {bouquet.reviews_count > 0 && (
                    <div className="absolute top-3 right-3 inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur-xs">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{bouquet.rating_average.toFixed(1)}</span>
                        <span className="text-white/70 font-normal">({bouquet.reviews_count})</span>
                    </div>
                )}
            </div>

            {/* Konten Kartu */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                    {/* Occasion Tags */}
                    {bouquet.occasions && bouquet.occasions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1.5">
                            {bouquet.occasions.map((occ) => (
                                <span
                                    key={occ.id}
                                    className="text-[10px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md"
                                >
                                    {occ.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <h3
                        onClick={() => onSelectBouquet(bouquet)}
                        className="font-bold text-stone-900 text-sm sm:text-base group-hover:text-sage-700 transition-colors cursor-pointer line-clamp-1"
                    >
                        {bouquet.title}
                    </h3>

                    <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                        {bouquet.description || 'Rangkaian bunga segar berkelas dengan kemasan kertas doff elegan.'}
                    </p>
                </div>

                {/* Harga & Tombol Aksi */}
                <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div>
                        <div className="text-[10px] text-stone-600 uppercase font-semibold">Harga</div>
                        <div className="text-sm sm:text-base font-extrabold text-stone-900 tracking-tight">
                            {formattedPrice}
                        </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                        <button
                            type="button"
                            onClick={() => onSelectBouquet(bouquet)}
                            className="px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                        >
                            Detail
                        </button>
                        <button
                            type="button"
                            onClick={() => onQuickOrder(bouquet)}
                            className="px-3.5 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center space-x-1"
                        >
                            <span>Pesan</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
