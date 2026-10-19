import React from 'react';
import { Search, Plus, Filter, RotateCcw } from 'lucide-react';
import { ReviewFilters } from '../types';

interface ReviewFilterBarProps {
    filters: ReviewFilters;
    onFilterChange: (key: keyof ReviewFilters, value: string) => void;
    onReset: () => void;
    onOpenCreateModal: () => void;
}

export default function ReviewFilterBar({
    filters,
    onFilterChange,
    onReset,
    onOpenCreateModal,
}: ReviewFilterBarProps) {
    return (
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col lg:flex-row gap-3.5 items-stretch lg:items-center justify-between">
            {/* Input Pencarian */}
            <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 text-stone-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    value={filters.search ?? ''}
                    onChange={(e) => onFilterChange('search', e.target.value)}
                    placeholder="Cari nama pengulas atau kutipan testimoni..."
                    className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-200/90 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all text-stone-800 placeholder-stone-600"
                />
            </div>

            {/* Kelompok Filter Dropdown */}
            <div className="flex flex-wrap items-center gap-2.5">
                {/* Filter Rating */}
                <select
                    value={filters.rating ?? 'all'}
                    onChange={(e) => onFilterChange('rating', e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-stone-200/90 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 cursor-pointer"
                >
                    <option value="all">Semua Rating</option>
                    <option value="5">★ 5 Bintang</option>
                    <option value="4">★ 4 Bintang</option>
                    <option value="3">★ 3 Bintang</option>
                    <option value="2">★ 2 Bintang</option>
                    <option value="1">★ 1 Bintang</option>
                </select>

                {/* Filter Sumber */}
                <select
                    value={filters.source ?? 'all'}
                    onChange={(e) => onFilterChange('source', e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-stone-200/90 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 cursor-pointer"
                >
                    <option value="all">Semua Saluran</option>
                    <option value="admin_curated">Kurasi Admin (WA/Foto)</option>
                    <option value="verified_order">Pesanan Terverifikasi</option>
                </select>

                {/* Filter Publikasi */}
                <select
                    value={filters.is_published ?? 'all'}
                    onChange={(e) => onFilterChange('is_published', e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-stone-200/90 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 cursor-pointer"
                >
                    <option value="all">Semua Status</option>
                    <option value="1">Dipublikasikan</option>
                    <option value="0">Disembunyikan</option>
                </select>

                {/* Tombol Reset */}
                <button
                    onClick={onReset}
                    title="Reset Filter"
                    className="p-2 text-stone-600 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>

                {/* Tombol Tambah Ulasan Manual */}
                <button
                    onClick={onOpenCreateModal}
                    className="flex items-center space-x-2 px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                    <Plus className="w-4 h-4 stroke-[2.2]" />
                    <span>Tambah Ulasan Manual</span>
                </button>
            </div>
        </div>
    );
}
