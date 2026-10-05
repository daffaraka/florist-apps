import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import FloristAdminLayout from '@/Layouts/FloristAdminLayout';
import { ItemCategory, UnitMeasurement } from '../flower-inventory/types';
import MasterDataHeader from './components/MasterDataHeader';
import CategoryListTable from './components/CategoryListTable';
import UnitListTable from './components/UnitListTable';
import CategoryFormModal from './components/CategoryFormModal';
import UnitFormModal from './components/UnitFormModal';

interface MasterDataIndexProps {
    categories: ItemCategory[];
    units: UnitMeasurement[];
    initialTab?: 'categories' | 'units';
    errors?: Record<string, string>;
}

export default function MasterDataIndex({
    categories = [],
    units = [],
    initialTab = 'categories',
    errors = {},
}: MasterDataIndexProps) {
    const [activeTab, setActiveTab] = useState<'categories' | 'units'>(initialTab);

    // Sync tab change with URL without full page reload
    const handleTabChange = (tab: 'categories' | 'units') => {
        setActiveTab(tab);
        router.get('/admin/master-data', { tab }, { preserveState: true, replace: true });
    };
    
    // Modals state
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ItemCategory | null>(null);

    const [unitModalOpen, setUnitModalOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<UnitMeasurement | null>(null);

    const handleAddNew = () => {
        if (activeTab === 'categories') {
            setEditingCategory(null);
            setCategoryModalOpen(true);
        } else {
            setEditingUnit(null);
            setUnitModalOpen(true);
        }
    };

    const handleEditCategory = (cat: ItemCategory) => {
        setEditingCategory(cat);
        setCategoryModalOpen(true);
    };

    const handleDeleteCategory = (cat: ItemCategory) => {
        if (confirm(`Yakin ingin menghapus kategori "${cat.name}"?`)) {
            router.delete(`/admin/master-data/categories/${cat.id}`);
        }
    };

    const handleEditUnit = (unit: UnitMeasurement) => {
        setEditingUnit(unit);
        setUnitModalOpen(true);
    };

    const handleDeleteUnit = (unit: UnitMeasurement) => {
        if (confirm(`Yakin ingin menghapus satuan "${unit.name}"?`)) {
            router.delete(`/admin/master-data/units/${unit.id}`);
        }
    };

    return (
        <FloristAdminLayout
            title="Master Data & Pengaturan Toko"
            subtitle="Kustomisasi kategori bahan baku dan satuan pengukuran workshop florist secara fleksibel."
        >
            <Head title="Master Data - Kategori & Satuan" />

            {/* Alert Error jika ada proteksi data terpicu */}
            {errors.error && (
                <div className="mb-5 p-4 rounded-2xl bg-terracotta-50 border border-terracotta-200 text-terracotta-800 text-xs flex items-center justify-between">
                    <span>{errors.error}</span>
                </div>
            )}

            {/* Header & Tab Controls */}
            <MasterDataHeader
                activeTab={activeTab}
                onTabChange={handleTabChange}
                categoriesCount={categories.length}
                unitsCount={units.length}
                onAddNew={handleAddNew}
            />

            {/* Konten Tab Aktif */}
            {activeTab === 'categories' ? (
                <CategoryListTable
                    categories={categories}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                />
            ) : (
                <UnitListTable
                    units={units}
                    onEdit={handleEditUnit}
                    onDelete={handleDeleteUnit}
                />
            )}

            {/* Modals Form */}
            <CategoryFormModal
                isOpen={categoryModalOpen}
                category={editingCategory}
                onClose={() => {
                    setCategoryModalOpen(false);
                    setEditingCategory(null);
                }}
            />

            <UnitFormModal
                isOpen={unitModalOpen}
                unit={editingUnit}
                onClose={() => {
                    setUnitModalOpen(false);
                    setEditingUnit(null);
                }}
            />
        </FloristAdminLayout>
    );
}
