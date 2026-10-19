import React from 'react';
import { StorefrontBouquet } from '../types';
import StorefrontBouquetCard from './StorefrontBouquetCard';
import { Flower2 } from 'lucide-react';

interface StorefrontBouquetGridProps {
    bouquets: StorefrontBouquet[];
    onSelectBouquet: (bouquet: StorefrontBouquet) => void;
    onQuickOrder: (bouquet: StorefrontBouquet) => void;
    onResetFilters: () => void;
}

export default function StorefrontBouquetGrid({
    bouquets,
    onSelectBouquet,
    onQuickOrder,
    onResetFilters,
}: StorefrontBouquetGridProps) {
    if (bouquets.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-12 border border-stone-200/80 shadow-xs text-center flex flex-col items-center justify-center my-6">
                <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-600 mb-4">
                    <Flower2 className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Buket Tidak Ditemukan</h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mt-1 mb-4 leading-relaxed">
                    Tidak ada buket yang sesuai dengan filter momen atau budget yang Anda pilih saat ini.
                </p>
                <button
                    type="button"
                    onClick={onResetFilters}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                    Tampilkan Semua Buket
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bouquets.map((bouquet) => (
                <StorefrontBouquetCard
                    key={bouquet.id}
                    bouquet={bouquet}
                    onSelectBouquet={onSelectBouquet}
                    onQuickOrder={onQuickOrder}
                />
            ))}
        </div>
    );
}
