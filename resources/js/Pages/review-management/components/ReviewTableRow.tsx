import React from 'react';
import { Star, Eye, EyeOff, Sparkles, Trash2, ShieldCheck, MessageSquareQuote } from 'lucide-react';
import { ReviewItem } from '../types';

interface ReviewTableRowProps {
    review: ReviewItem;
    onViewPhoto: (url: string, name: string) => void;
    onTogglePublished: (id: number) => void;
    onToggleFeatured: (id: number) => void;
    onDelete: (id: number, name: string) => void;
}

export default function ReviewTableRow({
    review,
    onViewPhoto,
    onTogglePublished,
    onToggleFeatured,
    onDelete,
}: ReviewTableRowProps) {
    const isVerified = review.source === 'verified_order';

    return (
        <tr className="hover:bg-stone-50/70 transition-colors border-b border-stone-100 last:border-b-0 text-xs">
            {/* Foto Buket / Screenshot */}
            <td className="py-3.5 px-4">
                {review.photo_url ? (
                    <button
                        type="button"
                        onClick={() => onViewPhoto(review.photo_url!, review.customer_name)}
                        className="group relative w-12 h-12 rounded-xl overflow-hidden border border-stone-200/90 shadow-2xs hover:scale-105 transition-transform cursor-pointer"
                        title="Klik untuk perbesar foto"
                    >
                        <img
                            src={review.photo_url}
                            alt={review.customer_name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px]">
                            Lihat
                        </div>
                    </button>
                ) : (
                    <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200/60 flex items-center justify-center text-stone-600">
                        <MessageSquareQuote className="w-5 h-5 stroke-[1.6]" />
                    </div>
                )}
            </td>

            {/* Nama Pengulas & Saluran */}
            <td className="py-3.5 px-4">
                <div className="font-semibold text-stone-800 text-xs">{review.customer_name}</div>
                <div className="text-[11px] text-stone-600 mt-0.5">{review.customer_handle || 'Pelanggan'}</div>
                <div className="mt-1 flex items-center space-x-1.5">
                    {isVerified ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-sage-50 text-sage-700 border border-sage-200">
                            <ShieldCheck className="w-3 h-3 text-sage-600" />
                            <span>Pesanan Terverifikasi</span>
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-600 border border-stone-200">
                            Kurasi Manual Admin
                        </span>
                    )}
                </div>
            </td>

            {/* Rating Bintang */}
            <td className="py-3.5 px-4 whitespace-nowrap">
                <div className="flex items-center space-x-0.5">
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
                    <span className="ml-1.5 font-bold text-stone-700 text-xs">{review.rating}.0</span>
                </div>
                <div className="text-[10px] text-stone-600 mt-0.5">
                    {review.review_date ?? review.created_at.slice(0, 10)}
                </div>
            </td>

            {/* Buket Terkait & Ulasan Teks */}
            <td className="py-3.5 px-4 max-w-xs">
                {review.bouquet ? (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200 mb-1">
                        💐 {review.bouquet.title}
                    </span>
                ) : (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-normal bg-stone-50 text-stone-600 border border-stone-150 mb-1">
                        🏪 Ulasan Umum Toko
                    </span>
                )}
                <p className="text-stone-700 text-xs line-clamp-2 leading-relaxed italic">
                    "{review.review_text}"
                </p>
            </td>

            {/* Status Publikasi & Featured */}
            <td className="py-3.5 px-4 whitespace-nowrap">
                <div className="flex flex-col space-y-1.5 items-start">
                    <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            review.is_published
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                    >
                        {review.is_published ? 'Tampil di Etalase' : 'Disembunyikan'}
                    </span>
                    {review.is_featured && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                            <span>Unggulan (Featured)</span>
                        </span>
                    )}
                </div>
            </td>

            {/* Aksi Cepat */}
            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end space-x-1.5">
                    <button
                        type="button"
                        onClick={() => onTogglePublished(review.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            review.is_published
                                ? 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}
                        title={review.is_published ? 'Sembunyikan dari Etalase' : 'Tampilkan ke Etalase'}
                    >
                        {review.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                        type="button"
                        onClick={() => onToggleFeatured(review.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            review.is_featured
                                ? 'bg-amber-100 text-amber-700 border-amber-300'
                                : 'bg-stone-50 hover:bg-amber-50 text-stone-600 hover:text-amber-600 border-stone-200'
                        }`}
                        title={review.is_featured ? 'Hapus dari Unggulan' : 'Jadikan Unggulan Etalase'}
                    >
                        <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(review.id, review.customer_name)}
                        className="p-1.5 rounded-lg bg-stone-50 hover:bg-rose-50 text-stone-600 hover:text-rose-600 border border-stone-200 transition-colors cursor-pointer"
                        title="Hapus Ulasan"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
