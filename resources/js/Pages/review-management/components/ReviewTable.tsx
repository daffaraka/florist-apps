import React from 'react';
import { ReviewItem } from '../types';
import ReviewTableRow from './ReviewTableRow';
import { MessageSquareOff } from 'lucide-react';

interface ReviewTableProps {
    reviews: ReviewItem[];
    onViewPhoto: (url: string, name: string) => void;
    onTogglePublished: (id: number) => void;
    onToggleFeatured: (id: number) => void;
    onDelete: (id: number, name: string) => void;
}

export default function ReviewTable({
    reviews,
    onViewPhoto,
    onTogglePublished,
    onToggleFeatured,
    onDelete,
}: ReviewTableProps) {
    if (reviews.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-12 border border-stone-200/80 shadow-xs text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-600 mb-3.5">
                    <MessageSquareOff className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="text-sm font-bold text-stone-800">Belum Ada Ulasan Ditemukan</h3>
                <p className="text-xs text-stone-600 max-w-sm mt-1">
                    Ulasan dari pesanan pelanggan atau input manual testimoni WhatsApp akan muncul di sini.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-stone-50/80 border-b border-stone-200/80 text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                            <th className="py-3 px-4">Foto Bukti</th>
                            <th className="py-3 px-4">Pengulas & Sumber</th>
                            <th className="py-3 px-4">Rating</th>
                            <th className="py-3 px-4">Buket & Komentar</th>
                            <th className="py-3 px-4">Status Etalase</th>
                            <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {reviews.map((review) => (
                            <ReviewTableRow
                                key={review.id}
                                review={review}
                                onViewPhoto={onViewPhoto}
                                onTogglePublished={onTogglePublished}
                                onToggleFeatured={onToggleFeatured}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
