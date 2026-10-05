import React from 'react';
import { Tag, Scale, Plus } from 'lucide-react';

interface MasterDataHeaderProps {
    activeTab: 'categories' | 'units';
    onTabChange: (tab: 'categories' | 'units') => void;
    categoriesCount: number;
    unitsCount: number;
    onAddNew: () => void;
}

export default function MasterDataHeader({
    activeTab,
    onTabChange,
    categoriesCount,
    unitsCount,
    onAddNew,
}: MasterDataHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            {/* Tab Switcher */}
            <div className="inline-flex p-1 bg-white border border-doff-border rounded-2xl shadow-2xs">
                <button
                    onClick={() => onTabChange('categories')}
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        activeTab === 'categories'
                            ? 'bg-sage-600 text-white shadow-xs'
                            : 'text-doff-muted hover:text-doff-charcoal hover:bg-doff-sand/60'
                    }`}
                >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Kategori Bahan</span>
                    <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            activeTab === 'categories'
                                ? 'bg-white/20 text-white'
                                : 'bg-doff-sand text-doff-muted'
                        }`}
                    >
                        {categoriesCount}
                    </span>
                </button>

                <button
                    onClick={() => onTabChange('units')}
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        activeTab === 'units'
                            ? 'bg-sage-600 text-white shadow-xs'
                            : 'text-doff-muted hover:text-doff-charcoal hover:bg-doff-sand/60'
                    }`}
                >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Satuan Pengukuran</span>
                    <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            activeTab === 'units'
                                ? 'bg-white/20 text-white'
                                : 'bg-doff-sand text-doff-muted'
                        }`}
                    >
                        {unitsCount}
                    </span>
                </button>
            </div>

            {/* Tombol Tambah Utama */}
            <button
                onClick={onAddNew}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-sage-600 hover:bg-sage-700 text-white shadow-xs transition-colors"
            >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>
                    {activeTab === 'categories' ? 'Tambah Kategori' : 'Tambah Satuan'}
                </span>
            </button>
        </div>
    );
}
