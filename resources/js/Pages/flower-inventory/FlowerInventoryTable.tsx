import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FloristAdminLayout from '@/Layouts/FloristAdminLayout';
import { PaginatedInventoryItems, InventoryItem, ItemCategory, UnitMeasurement } from './types';
import InventoryCategoryTabs from './components/InventoryCategoryTabs';
import InventoryItemRowCard from './components/InventoryItemRowCard';
import InventoryQuickRestockModal from './components/InventoryQuickRestockModal';
import InventorySingleTapWasteModal from './components/InventorySingleTapWasteModal';
import { Plus, Search, Package } from 'lucide-react';

interface FlowerInventoryTableProps {
    items: PaginatedInventoryItems;
    categories?: ItemCategory[];
    units?: UnitMeasurement[];
    filters: {
        category?: string;
        search?: string;
    };
}

export default function FlowerInventoryTable({
    items,
    categories = [],
    units = [],
    filters,
}: FlowerInventoryTableProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
    const [wasteItem, setWasteItem] = useState<InventoryItem | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/inventory',
            { ...filters, search: searchTerm },
            { preserveState: true, replace: true }
        );
    };

    const handleCategorySelect = (category: string) => {
        router.get(
            '/admin/inventory',
            { ...filters, category: category || undefined },
            { preserveState: true, replace: true }
        );
    };

    return (
        <FloristAdminLayout
            title="Inventori & Stok Bahan Baku"
            subtitle="Kelola stok tangkai bunga, kertas wrapping, pita, aksesoris, dan catat bunga layu."
        >
            <Head title="Inventori Bahan Baku" />

            {/* Bar Kontrol Atas: Search & Tombol Tambah */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-doff-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Cari nama bahan, kode SKU, atau barcode..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-xs rounded-xl border border-doff-border pl-10 pr-4 py-2.5 bg-white shadow-2xs focus:border-sage-500 focus:ring-0"
                    />
                </form>

                <Link
                    href="/admin/inventory/create"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-sage-600 text-white hover:bg-sage-700 shadow-xs transition-colors"
                >
                    <Plus className="w-4 h-4 stroke-[2]" />
                    <span>Tambah Bahan</span>
                </Link>
            </div>

            {/* Filter Tab Kategori */}
            <div className="mb-5">
                <InventoryCategoryTabs
                    activeCategory={filters.category || ''}
                    onSelectCategory={handleCategorySelect}
                    categories={categories}
                />
            </div>

            {/* Tabel Kontainer */}
            <div className="bg-white rounded-2xl border border-doff-border shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-doff-sand/60 text-doff-muted border-b border-doff-border text-xs">
                            <tr>
                                <th className="px-5 py-3 font-medium">Bahan Baku & SKU</th>
                                <th className="px-4 py-3 font-medium">Kategori</th>
                                <th className="px-4 py-3 font-medium">Harga Modal</th>
                                <th className="px-4 py-3 font-medium">Stok Fisik</th>
                                <th className="px-5 py-3 font-medium text-right">Aksi Cepat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.data.length > 0 ? (
                                items.data.map((item) => (
                                    <InventoryItemRowCard
                                        key={item.id}
                                        item={item}
                                        onQuickRestock={(i) => setRestockItem(i)}
                                        onRecordWaste={(i) => setWasteItem(i)}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-doff-muted text-xs">
                                        <Package className="w-8 h-8 text-doff-border mx-auto mb-2" />
                                        <p>Tidak ada bahan inventori yang ditemukan.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {items.links && items.links.length > 3 && (
                    <div className="p-4 border-t border-doff-border flex items-center justify-between text-xs">
                        <span className="text-doff-muted">
                            Total: <strong className="text-doff-charcoal">{items.total}</strong> bahan
                        </span>
                        <div className="flex items-center space-x-1">
                            {items.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                                        link.active
                                            ? 'bg-sage-600 text-white font-semibold'
                                            : 'text-doff-muted hover:bg-doff-sand disabled:opacity-40'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <InventoryQuickRestockModal item={restockItem} onClose={() => setRestockItem(null)} />
            <InventorySingleTapWasteModal item={wasteItem} onClose={() => setWasteItem(null)} />
        </FloristAdminLayout>
    );
}
