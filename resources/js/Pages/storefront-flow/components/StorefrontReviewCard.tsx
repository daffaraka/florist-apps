import React from 'react';
import { Star, ShieldCheck, Heart } from 'lucide-react';
import { StorefrontReview } from '../types';

interface StorefrontReviewCardProps {
    review: StorefrontReview;
    onViewPhoto: (photoUrl: string, caption: string) => void;
}

export default function StorefrontReviewCard({
    review,
    onViewPhoto,
}: StorefrontReviewCardProps) {
    const isVerified = review.source === 'verified_order';

    return (
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
                {/* Foto Testimoni Buket Jika Ada */}
                {review.photo_url && (
                    <div
                        className="relative aspect-4/3 w-full rounded-2xl overflow-hidden mb-3.5 bg-stone-100 cursor-pointer group"
                        onClick={() =>
                            onViewPhoto(
                                review.photo_url!,
                                `Testimoni dari ${review.customer_name}`
                            )
                        }
                    >
                        <img
                            src={review.photo_url}
                            alt={review.customer_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                            🔍 Perbesar Foto
                        </div>
                    </div>
                )}

                {/* Rating Bintang */}
                <div className="flex items-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                                star <= review.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-stone-200'
                            }`}
                        />
                    ))}
                    <span className="text-xs font-bold text-stone-700 ml-1">
                        {review.rating}.0
                    </span>
                </div>

                {/* Tag Buket yang Dipesan */}
                {review.bouquet && (
                    <div className="mb-2">
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                            <span>💐</span>
                            <span className="truncate">{review.bouquet.title}</span>
                        </span>
                    </div>
                )}

                {/* Kutipan Komentar */}
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed italic mb-4">
                    "{review.review_text}"
                </p>
            </div>

            {/* Profil Pengulas & Badge Terverifikasi */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-stone-900 text-xs">{review.customer_name}</h4>
                    <span className="text-[11px] text-stone-600 block mt-0.5">
                        {review.customer_handle || 'Pelanggan Toko'}
                    </span>
                </div>

                <div>
                    {isVerified ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-sage-50 text-sage-700 border border-sage-200">
                            <ShieldCheck className="w-3 h-3 text-sage-600" />
                            <span>Verified</span>
                        </span>
                    ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-600 border border-stone-200">
                            <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
                            <span>Story</span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
