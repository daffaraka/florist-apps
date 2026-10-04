import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, LayoutGrid, List, Search } from 'lucide-react';
import FloristAdminLayout from '@/Layouts/FloristAdminLayout';
import {
    BouquetItem,
    PaginatedBouquets,
    InventoryItemOption,
    OccasionItem,
    CatalogFilterState,
} from './types';
import BouquetCatalogGrid from './components/BouquetCatalogGrid';
import BouquetCatalogTable from './components/BouquetCatalogTable';
import BouquetCreateModal from './components/BouquetCreateModal';
import BouquetEditModal from './components/BouquetEditModal';

interface BouquetCatalogListProps {
    bouquets: PaginatedBouquets;
    available_items: InventoryItemOption[];
    occasions: OccasionItem[];
    filters: CatalogFilterState;
}

export default function BouquetCatalogList({
    bouquets,
    available_items,
    occasions,
    filters,
}: BouquetCatalogListProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingBouquet, setEditingBouquet] = useState<BouquetItem | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/bouquets', { ...filters, search }, { preserveState: true });
    };

    const handleFilterChange = (key: string, val: string | number | undefined) => {
        const newFilters = { ...filters, [key]: val };
        if (!val) delete newFilters[key as keyof CatalogFilterState];
        router.get('/admin/bouquets', newFilters, { preserveState: true });
    };

    const handleToggle = (
        bouquet: BouquetItem,
        field: 'is_active' | 'is_ready_stock' | 'is_featured'
    ) => {
        router.post(
            `/admin/bouquets/${bouquet.id}/toggle`,
            { field },
            { preserveScroll: true }
        );
    };

    const handleDelete = (bouquet: BouquetItem) => {
        if (confirm(`Yakin ingin menghapus buket "${bouquet.title}" dari katalog?`)) {
            router.delete(`/admin/bouquets/${bouquet.id}`, { preserveScroll: true });
        }
    };

    return (
        <FloristAdminLayout
            title="Katalog Buket & Etalase Toko"
            subtitle="Atur etalase publik, status ready stock/PO, dan komposisi resep bahan"
        >
            <Head title="Katalog Buket - Owner Panel" />

            {/* Top Bar: Action & Filters */}
            <div className="space-y-4 mb-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {/* Search Form */}
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-doff-muted" />
                        <input
                            type="text"
                            placeholder="Cari buket..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-doff-border rounded-xl focus:ring-1 focus:ring-sage-500"
                        />
                    </form>

                    {/* View Switcher & Create Button */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <div className="flex bg-white border border-doff-border rounded-xl p-0.5">
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-lg transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-sage-600 text-white'
                                        : 'text-doff-muted hover:text-doff-charcoal'
                                }`}
                                title="Mode Kartu Grid"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                className={`p-1.5 rounded-lg transition-colors ${
                                    viewMode === 'table'
                                        ? 'bg-sage-600 text-white'
                                        : 'text-doff-muted hover:text-doff-charcoal'
                                }`}
                                title="Mode Tabel Ringkas"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Buket Baru</span>
                        </button>
                    </div>
                </div>

                {/* Filter Occasions & Stock Mode */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <button
                        type="button"
                        onClick={() => handleFilterChange('occasion_id', undefined)}
                        className={`px-3 py-1 rounded-full border transition-colors ${
                            !filters.occasion_id
                                ? 'bg-sage-600 text-white border-sage-600 font-medium'
                                : 'bg-white border-doff-border text-doff-charcoal hover:border-sage-300'
                        }`}
                    >
                        Semua Momen
                    </button>
                    {occasions.map((occ) => (
                        <button
                            key={occ.id}
                            type="button"
                            onClick={() =>
                                handleFilterChange(
                                    'occasion_id',
                                    String(filters.occasion_id) === String(occ.id) ? undefined : occ.id
                                )
                            }
                            className={`px-3 py-1 rounded-full border transition-colors ${
                                String(filters.occasion_id) === String(occ.id)
                                    ? 'bg-sage-600 text-white border-sage-600 font-medium'
                                    : 'bg-white border-doff-border text-doff-charcoal hover:border-sage-300'
                            }`}
                        >
                            {occ.emoji} {occ.name}
                        </button>
                    ))}

                    <div className="h-4 w-px bg-doff-border mx-1 hidden sm:block" />

                    <select
                        value={filters.is_ready_stock ?? ''}
                        onChange={(e) => handleFilterChange('is_ready_stock', e.target.value || undefined)}
                        className="py-1 px-3 text-xs bg-white border border-doff-border rounded-full text-doff-charcoal focus:ring-1 focus:ring-sage-500"
                    >
                        <option value="">Semua Stok</option>
                        <option value="true">Ready Stock</option>
                        <option value="false">Pre-Order</option>
                    </select>
                </div>
            </div>

            {/* Catalog Content (Grid or Table) */}
            {viewMode === 'grid' ? (
                <BouquetCatalogGrid
                    bouquets={bouquets.data}
                    onEdit={(b) => setEditingBouquet(b)}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                />
            ) : (
                <BouquetCatalogTable
                    bouquets={bouquets.data}
                    onEdit={(b) => setEditingBouquet(b)}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                />
            )}

            {/* Pagination Controls */}
            {bouquets.links && bouquets.links.length > 3 && (
                <div className="flex items-center justify-center gap-1.5 mt-8">
                    {bouquets.links.map((link, idx) => (
                        <button
                            key={idx}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                link.active
                                    ? 'bg-sage-600 text-white'
                                    : link.url
                                    ? 'bg-white text-doff-charcoal border border-doff-border hover:bg-doff-sand'
                                    : 'text-doff-muted opacity-40 cursor-not-allowed'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            <BouquetCreateModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                availableItems={available_items}
                occasions={occasions}
            />

            <BouquetEditModal
                bouquet={editingBouquet}
                isOpen={!!editingBouquet}
                onClose={() => setEditingBouquet(null)}
                availableItems={available_items}
                occasions={occasions}
            />
        </FloristAdminLayout>
    );
}
