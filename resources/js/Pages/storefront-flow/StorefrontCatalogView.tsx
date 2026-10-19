import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    StorefrontTenant,
    StorefrontBouquet,
    StorefrontReview,
    OccasionItem,
    StorefrontFilters,
} from './types';
import StorefrontHeaderBanner from './components/StorefrontHeaderBanner';
import StorefrontOccasionFilter from './components/StorefrontOccasionFilter';
import StorefrontBouquetGrid from './components/StorefrontBouquetGrid';
import StorefrontBouquetDetailModal from './components/StorefrontBouquetDetailModal';
import StorefrontWallOfLoveSection from './components/StorefrontWallOfLoveSection';
import StorefrontWhatsAppOrderDrawer from './components/StorefrontWhatsAppOrderDrawer';
import StorefrontPhotoLightboxModal from './components/StorefrontPhotoLightboxModal';
import StorefrontCustomerReviewModal from './components/StorefrontCustomerReviewModal';

interface StorefrontCatalogViewProps {
    tenant: StorefrontTenant;
    bouquets: StorefrontBouquet[];
    occasions: OccasionItem[];
    reviews: StorefrontReview[];
    activeFilters: StorefrontFilters;
}

export default function StorefrontCatalogView({
    tenant,
    bouquets,
    occasions,
    reviews,
    activeFilters,
}: StorefrontCatalogViewProps) {
    const [selectedBouquet, setSelectedBouquet] = useState<StorefrontBouquet | null>(null);
    const [orderingBouquet, setOrderingBouquet] = useState<StorefrontBouquet | null>(null);
    const [isCustomerReviewOpen, setIsCustomerReviewOpen] = useState(false);
    const [lightbox, setLightbox] = useState<{ url: string | null; caption: string }>({
        url: null,
        caption: '',
    });

    const updateFilter = (newFilters: Partial<StorefrontFilters>) => {
        router.get(
            '/store',
            { ...activeFilters, ...newFilters },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const handleResetFilters = () => {
        router.get('/store', {}, { preserveState: true, replace: true });
    };

    const scrollToWallOfLove = () => {
        document.getElementById('wall-of-love')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-stone-50/40 text-stone-900 font-sans antialiased flex flex-col justify-between">
            <Head title={`${tenant.name} — Etalase Bunga Artisan & Pemesanan WhatsApp`} />

            <div>
                {/* Header Profil Florist & Rating Ringkasan */}
                <StorefrontHeaderBanner
                    tenant={tenant}
                    onScrollToReviews={scrollToWallOfLove}
                />

                {/* Kontainer Utama Etalase */}
                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                    {/* Bilah Filter Momen & Budget */}
                    <StorefrontOccasionFilter
                        occasions={occasions}
                        filters={activeFilters}
                        onSelectOccasion={(slug) => updateFilter({ occasion: slug })}
                        onToggleReadyOnly={() =>
                            updateFilter({ ready_only: !activeFilters.ready_only })
                        }
                        onSelectMaxPrice={(price) => updateFilter({ max_price: price })}
                    />

                    {/* Grid Katalog Buket */}
                    <StorefrontBouquetGrid
                        bouquets={bouquets}
                        onSelectBouquet={(b) => setSelectedBouquet(b)}
                        onQuickOrder={(b) => setOrderingBouquet(b)}
                        onResetFilters={handleResetFilters}
                    />

                    {/* Seksi "Wall of Love" (Galeri Testimoni & Review Pelanggan) */}
                    <StorefrontWallOfLoveSection
                        reviews={reviews}
                        ratingSummary={tenant.rating_summary}
                        onViewPhoto={(url, caption) => setLightbox({ url, caption })}
                        onOpenCustomerReviewModal={() => setIsCustomerReviewOpen(true)}
                    />
                </main>
            </div>

            {/* Footer Sederhana */}
            <footer className="border-t border-stone-200/60 bg-white py-6 text-center text-xs text-stone-600">
                <div className="max-w-6xl mx-auto px-4">
                    <p className="font-semibold text-stone-700">© 2026 {tenant.name}. All rights reserved.</p>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                        Didukung oleh Bloom Artisan — Platform SaaS Florist Modern & WhatsApp-First.
                    </p>
                </div>
            </footer>

            {/* Modal Detail Buket */}
            <StorefrontBouquetDetailModal
                isOpen={Boolean(selectedBouquet)}
                bouquet={selectedBouquet}
                onClose={() => setSelectedBouquet(null)}
                onOrderNow={(b) => setOrderingBouquet(b)}
                onViewPhoto={(url, caption) => setLightbox({ url, caption })}
            />

            {/* Drawer Pemesanan WhatsApp */}
            <StorefrontWhatsAppOrderDrawer
                isOpen={Boolean(orderingBouquet)}
                bouquet={orderingBouquet}
                tenant={tenant}
                onClose={() => setOrderingBouquet(null)}
            />

            {/* Lightbox Pembesar Foto */}
            <StorefrontPhotoLightboxModal
                isOpen={Boolean(lightbox.url)}
                photoUrl={lightbox.url}
                caption={lightbox.caption}
                onClose={() => setLightbox({ url: null, caption: '' })}
            />

            {/* Modal Submit Ulasan Pelanggan */}
            <StorefrontCustomerReviewModal
                isOpen={isCustomerReviewOpen}
                onClose={() => setIsCustomerReviewOpen(false)}
            />
        </div>
    );
}
