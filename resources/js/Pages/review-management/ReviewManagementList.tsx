import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import FloristAdminLayout from '@/Layouts/FloristAdminLayout';
import {
    ReviewItem,
    ReviewStats,
    ReviewFilters,
    PaginatedReviews,
    BouquetOption,
} from './types';
import ReviewStatsCards from './components/ReviewStatsCards';
import ReviewFilterBar from './components/ReviewFilterBar';
import ReviewTable from './components/ReviewTable';
import ReviewCreateModal from './components/ReviewCreateModal';
import ReviewPhotoLightbox from './components/ReviewPhotoLightbox';

interface ReviewManagementListProps {
    reviews: PaginatedReviews;
    filters: ReviewFilters;
    stats: ReviewStats;
    availableBouquets: BouquetOption[];
}

export default function ReviewManagementList({
    reviews,
    filters,
    stats,
    availableBouquets,
}: ReviewManagementListProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [lightboxData, setLightboxData] = useState<{ url: string | null; name: string }>({
        url: null,
        name: '',
    });

    const handleFilterChange = (key: keyof ReviewFilters, value: string) => {
        router.get(
            '/admin/reviews',
            { ...filters, [key]: value },
            { preserveState: true, replace: true }
        );
    };

    const handleResetFilter = () => {
        router.get('/admin/reviews', {}, { preserveState: true, replace: true });
    };

    const handleTogglePublished = (id: number) => {
        router.post(`/admin/reviews/${id}/toggle-published`, {}, { preserveScroll: true });
    };

    const handleToggleFeatured = (id: number) => {
        router.post(`/admin/reviews/${id}/toggle-featured`, {}, { preserveScroll: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus ulasan dari "${name}"?`)) {
            router.delete(`/admin/reviews/${id}`, { preserveScroll: true });
        }
    };

    const handleViewPhoto = (url: string, name: string) => {
        setLightboxData({ url, name });
    };

    return (
        <FloristAdminLayout
            title="Ulasan & Testimoni Pelanggan"
            subtitle="Kelola kepuasan pelanggan, ulasan pesanan otomatis, dan kurasi foto testimoni WhatsApp."
        >
            <Head title="Manajemen Ulasan & Testimoni Pelanggan" />

            <div className="space-y-6">
                {/* Header Judul Halaman */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                            Ulasan & Testimoni Pelanggan
                        </h1>
                        <p className="text-xs sm:text-sm text-stone-600 mt-1">
                            Kelola kepuasan pelanggan, ulasan pesanan otomatis, serta kurasi foto testimoni WhatsApp untuk etalase publik.
                        </p>
                    </div>
                </div>

                {/* Kartu Statistik KPI */}
                <ReviewStatsCards stats={stats} />

                {/* Bilah Filter dan Tombol Tambah */}
                <ReviewFilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilter}
                    onOpenCreateModal={() => setIsCreateOpen(true)}
                />

                {/* Tabel Daftar Ulasan */}
                <ReviewTable
                    reviews={reviews.data}
                    onViewPhoto={handleViewPhoto}
                    onTogglePublished={handleTogglePublished}
                    onToggleFeatured={handleToggleFeatured}
                    onDelete={handleDelete}
                />
            </div>

            {/* Modal Tambah Ulasan Manual */}
            <ReviewCreateModal
                isOpen={isCreateOpen}
                availableBouquets={availableBouquets}
                onClose={() => setIsCreateOpen(false)}
            />

            {/* Lightbox Pembesar Foto */}
            <ReviewPhotoLightbox
                isOpen={Boolean(lightboxData.url)}
                imageUrl={lightboxData.url}
                caption={`Foto Ulasan dari ${lightboxData.name}`}
                onClose={() => setLightboxData({ url: null, name: '' })}
            />
        </FloristAdminLayout>
    );
}
