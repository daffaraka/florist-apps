import React from 'react';
import { Heart, MessageSquarePlus, Star } from 'lucide-react';
import { StorefrontReview, RatingSummary } from '../types';
import StorefrontReviewCard from './StorefrontReviewCard';

interface StorefrontWallOfLoveSectionProps {
    reviews: StorefrontReview[];
    ratingSummary: RatingSummary;
    onViewPhoto: (photoUrl: string, caption: string) => void;
    onOpenCustomerReviewModal: () => void;
}

export default function StorefrontWallOfLoveSection({
    reviews,
    ratingSummary,
    onViewPhoto,
    onOpenCustomerReviewModal,
}: StorefrontWallOfLoveSectionProps) {
    if (reviews.length === 0) return null;

    return (
        <section id="wall-of-love" className="py-12 border-t border-stone-200/60 mt-10">
            {/* Header Seksi */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70 mb-2">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span>Wall of Love • Suara Pelanggan</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif">
                        Cerita & Senyuman Penerima Bunga
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
                        Lihat foto asli rangkaian bunga yang tiba di lokasi serta testimoni tulus dari mereka yang telah mempercayakan momennya kepada kami.
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        type="button"
                        onClick={onOpenCustomerReviewModal}
                        className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-stone-50 text-stone-800 rounded-2xl text-xs font-semibold border border-stone-300 shadow-xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap"
                    >
                        <MessageSquarePlus className="w-4 h-4 text-sage-600" />
                        <span>Beri Ulasan Pesanan</span>
                    </button>
                </div>
            </div>

            {/* Grid Kartu Testimoni */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((rev) => (
                    <StorefrontReviewCard
                        key={rev.id}
                        review={rev}
                        onViewPhoto={onViewPhoto}
                    />
                ))}
            </div>
        </section>
    );
}
