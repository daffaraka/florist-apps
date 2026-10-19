import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { OccasionItem, StorefrontFilters } from '../types';

interface StorefrontOccasionFilterProps {
    occasions: OccasionItem[];
    filters: StorefrontFilters;
    onSelectOccasion: (slug: string) => void;
    onToggleReadyOnly: () => void;
    onSelectMaxPrice: (price: string) => void;
}

export default function StorefrontOccasionFilter({
    occasions,
    filters,
    onSelectOccasion,
    onToggleReadyOnly,
    onSelectMaxPrice,
}: StorefrontOccasionFilterProps) {
    const budgetOptions = [
        { label: 'Semua Budget', value: '' },
        { label: '< Rp 250rb', value: '250000' },
        { label: '< Rp 350rb', value: '350000' },
    ];

    return (
        <div className="space-y-4 py-2">
            {/* Pill Tab Momen / Occasion */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                    type="button"
                    onClick={() => onSelectOccasion('all')}
                    className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                        filters.occasion === 'all'
                            ? 'bg-stone-900 text-white shadow-sm'
                            : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200/80 hover:border-stone-300'
                    }`}
                >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Semua Momen</span>
                </button>

                {occasions.map((occ) => (
                    <button
                        key={occ.id}
                        type="button"
                        onClick={() => onSelectOccasion(occ.slug)}
                        className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                            filters.occasion === occ.slug
                                ? 'bg-sage-600 text-white shadow-sm'
                                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200/80 hover:border-stone-300'
                        }`}
                    >
                        <span>{occ.emoji || '💐'}</span>
                        <span>{occ.name}</span>
                    </button>
                ))}
            </div>

            {/* Sub-Filter: Ready Stock Switch & Budget Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {/* Switch Ready Stock */}
                <button
                    type="button"
                    onClick={onToggleReadyOnly}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        filters.ready_only
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-300'
                            : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                    }`}
                >
                    <Zap
                        className={`w-3.5 h-3.5 ${
                            filters.ready_only ? 'text-emerald-600 fill-emerald-600' : 'text-stone-600'
                        }`}
                    />
                    <span>Hanya Ready Stock (Bisa Kirim Hari Ini)</span>
                </button>

                {/* Filter Budget */}
                <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] text-stone-600 font-medium mr-1">Budget:</span>
                    {budgetOptions.map((b) => (
                        <button
                            key={b.label}
                            type="button"
                            onClick={() => onSelectMaxPrice(b.value)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                                filters.max_price === b.value
                                    ? 'bg-stone-800 text-white'
                                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                            }`}
                        >
                            {b.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
