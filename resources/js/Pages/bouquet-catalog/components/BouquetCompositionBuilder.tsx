import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, Check } from 'lucide-react';
import { InventoryItemOption } from '../types';

export interface SelectedComposition {
    inventory_item_id: number;
    required_quantity: number;
}

interface BouquetCompositionBuilderProps {
    availableItems: InventoryItemOption[];
    selectedCompositions: SelectedComposition[];
    onChange: (compositions: SelectedComposition[]) => void;
}

export default function BouquetCompositionBuilder({
    availableItems,
    selectedCompositions,
    onChange,
}: BouquetCompositionBuilderProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const categoryTabs = [
        { key: 'all', label: 'Semua' },
        { key: 'fresh_flower', label: 'Bunga Segar' },
        { key: 'wrapping_paper', label: 'Wrapping' },
        { key: 'ribbon', label: 'Pita' },
        { key: 'accessory', label: 'Aksesoris' },
    ];

    const filteredItems = useMemo(() => {
        return availableItems.filter((item) => {
            const matchesCategory =
                selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch = item.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [availableItems, selectedCategory, searchQuery]);

    const getQuantity = (itemId: number): number => {
        const found = selectedCompositions.find((c) => c.inventory_item_id === itemId);
        return found ? found.required_quantity : 0;
    };

    const handleUpdateQuantity = (itemId: number, delta: number) => {
        const currentQty = getQuantity(itemId);
        const newQty = Math.max(0, parseFloat((currentQty + delta).toFixed(1)));

        let updated: SelectedComposition[];
        if (newQty === 0) {
            updated = selectedCompositions.filter((c) => c.inventory_item_id !== itemId);
        } else {
            const existingIndex = selectedCompositions.findIndex(
                (c) => c.inventory_item_id === itemId
            );
            if (existingIndex >= 0) {
                updated = [...selectedCompositions];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    required_quantity: newQty,
                };
            } else {
                updated = [
                    ...selectedCompositions,
                    { inventory_item_id: itemId, required_quantity: newQty },
                ];
            }
        }
        onChange(updated);
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val || 0);
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <span className="text-sm font-semibold text-doff-charcoal">
                    Resep Bahan (Bill of Materials)
                    <span className="ml-2 text-xs font-normal text-doff-muted">
                        ({selectedCompositions.length} jenis bahan dipilih)
                    </span>
                </span>

                {/* Search Bar */}
                <div className="relative w-full sm:w-56">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-doff-muted" />
                    <input
                        type="text"
                        placeholder="Cari bahan baku..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-doff-border rounded-lg focus:ring-1 focus:ring-sage-500 focus:border-sage-500"
                    />
                </div>
            </div>

            {/* Category Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                {categoryTabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setSelectedCategory(tab.key)}
                        className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                            selectedCategory === tab.key
                                ? 'bg-sage-600 text-white font-medium'
                                : 'bg-doff-sand/80 text-doff-charcoal hover:bg-doff-border/70'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Visual Item Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-1 border border-doff-border rounded-xl bg-doff-sand/30">
                {filteredItems.map((item) => {
                    const qty = getQuantity(item.id);
                    const isSelected = qty > 0;

                    return (
                        <div
                            key={item.id}
                            className={`p-2.5 rounded-lg border transition-all text-xs flex flex-col justify-between ${
                                isSelected
                                    ? 'bg-sage-50/80 border-sage-300 shadow-sm'
                                    : 'bg-white border-doff-border hover:border-sage-200'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-1 mb-1.5">
                                <div>
                                    <p className="font-semibold text-doff-charcoal line-clamp-1">
                                        {item.name}
                                    </p>
                                    <p className="text-[11px] text-doff-muted">
                                        {formatCurrency(item.unit_cost)} / {item.unit_measurement}
                                    </p>
                                </div>
                                {isSelected && (
                                    <span className="p-0.5 rounded-full bg-sage-500 text-white flex-shrink-0">
                                        <Check className="w-3 h-3" />
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-doff-border/50">
                                <span className="text-[10px] text-doff-muted">
                                    Stok: {item.stock_quantity}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        disabled={qty <= 0}
                                        onClick={() => handleUpdateQuantity(item.id, -1)}
                                        className="w-6 h-6 rounded bg-doff-sand hover:bg-doff-border text-doff-charcoal flex items-center justify-center disabled:opacity-40 transition-colors"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-6 text-center font-bold text-doff-charcoal">
                                        {qty}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateQuantity(item.id, 1)}
                                        className="w-6 h-6 rounded bg-sage-100 hover:bg-sage-200 text-sage-800 flex items-center justify-center transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredItems.length === 0 && (
                    <div className="col-span-full py-6 text-center text-xs text-doff-muted">
                        Tidak ada item inventori yang cocok dengan pencarian.
                    </div>
                )}
            </div>
        </div>
    );
}
