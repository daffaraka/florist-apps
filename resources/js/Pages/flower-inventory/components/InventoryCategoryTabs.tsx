import React from 'react';
import { InventoryCategory, ItemCategory } from '../types';

interface InventoryCategoryTabsProps {
    activeCategory: string;
    onSelectCategory: (category: string) => void;
    categories?: ItemCategory[];
}

export default function InventoryCategoryTabs({
    activeCategory,
    onSelectCategory,
    categories = [],
}: InventoryCategoryTabsProps) {
    const tabs: Array<{ id: string; label: string }> = [
        { id: '', label: 'Semua Bahan' },
        ...(categories.length > 0
            ? categories.map((c) => ({ id: c.slug, label: c.name }))
            : [
                  { id: 'fresh_flower', label: 'Bunga Segar' },
                  { id: 'wrapping_paper', label: 'Kertas Wrapping' },
                  { id: 'ribbon', label: 'Pita Satin' },
                  { id: 'accessory', label: 'Aksesoris & Boneka' },
                  { id: 'greeting_card', label: 'Kartu Ucapan' },
              ]),
    ];

    return (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {tabs.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                    <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                            isActive
                                ? 'bg-sage-600 text-white shadow-xs font-semibold'
                                : 'bg-white text-doff-muted hover:text-doff-charcoal hover:bg-doff-sand border border-doff-border'
                        }`}
                    >
                        {cat.label}
                    </button>
                );
            })}
        </div>
    );
}
