import React from 'react';
import { Star, Image, ShieldCheck, MessageSquare } from 'lucide-react';
import { ReviewStats } from '../types';

interface ReviewStatsCardsProps {
    stats: ReviewStats;
}

export default function ReviewStatsCards({ stats }: ReviewStatsCardsProps) {
    const cards = [
        {
            label: 'Total Ulasan Terkumpul',
            value: stats.total_reviews,
            unit: 'Ulasan',
            icon: MessageSquare,
            colorBg: 'bg-stone-100/80',
            colorIcon: 'text-stone-700',
            desc: 'Dari semua saluran feedback',
        },
        {
            label: 'Rata-rata Kepuasan',
            value: stats.average_rating.toFixed(1),
            unit: '/ 5.0',
            icon: Star,
            colorBg: 'bg-amber-50',
            colorIcon: 'text-amber-600',
            desc: 'Tingkat kepuasan bunga & layanan',
        },
        {
            label: 'Ulasan dengan Foto Asli',
            value: stats.with_photos_count,
            unit: 'Foto',
            icon: Image,
            colorBg: 'bg-rose-50',
            colorIcon: 'text-rose-600',
            desc: 'Bukti visual bunga diterima',
        },
        {
            label: 'Pesanan Terverifikasi',
            value: stats.verified_count,
            unit: 'Pesanan',
            icon: ShieldCheck,
            colorBg: 'bg-sage-50',
            colorIcon: 'text-sage-700',
            desc: 'Tervalidasi nomor pesanan resmi',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c) => {
                const Icon = c.icon;
                return (
                    <div
                        key={c.label}
                        className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between transition-all duration-200 hover:shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-stone-600">{c.label}</span>
                            <div className={`p-2.5 rounded-xl ${c.colorBg}`}>
                                <Icon className={`w-4 h-4 stroke-[2] ${c.colorIcon}`} />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-baseline space-x-1.5">
                                <span className="text-2xl font-bold text-stone-900 tracking-tight">{c.value}</span>
                                <span className="text-xs text-stone-500 font-medium">{c.unit}</span>
                            </div>
                            <p className="text-[11px] text-stone-600 mt-1">{c.desc}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
