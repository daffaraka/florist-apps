import React from 'react';
import { Star, Flower2, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { StorefrontTenant } from '../types';

interface StorefrontHeaderBannerProps {
    tenant: StorefrontTenant;
    onScrollToReviews: () => void;
}

export default function StorefrontHeaderBanner({
    tenant,
    onScrollToReviews,
}: StorefrontHeaderBannerProps) {
    return (
        <header className="relative bg-gradient-to-b from-stone-100/70 via-stone-50/50 to-transparent border-b border-stone-200/60 pb-8 pt-6 sm:pt-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    {/* Profil & Brand Florist */}
                    <div className="flex items-start sm:items-center space-x-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                            {tenant.logo_url ? (
                                <img src={tenant.logo_url} alt={tenant.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-sage-50 text-sage-600 flex items-center justify-center">
                                    <Flower2 className="w-8 h-8 stroke-[1.7]" />
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif">
                                    {tenant.name}
                                </h1>
                                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Buka & Terima Pesanan</span>
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mt-1 leading-relaxed">
                                {tenant.about_text || 'Studio Florist Artisan dengan spesialisasi bunga segar pilihan dan buket puitis.'}
                            </p>

                            {/* Badge Social Proof & Rating Ringkasan */}
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                                <button
                                    type="button"
                                    onClick={onScrollToReviews}
                                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50/90 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200/80 transition-colors cursor-pointer"
                                >
                                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                    <span>{tenant.rating_summary.average} / 5.0</span>
                                    <span className="text-amber-800/80 font-normal">
                                        ({tenant.rating_summary.total_count} Ulasan Pelanggan)
                                    </span>
                                </button>

                                <span className="inline-flex items-center space-x-1 text-xs text-stone-600 font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-sage-600" />
                                    <span>100% Bunga Segar Pilihan</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Kontak WhatsApp Cepat */}
                    <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-2.5">
                        <a
                            href={`https://wa.me/${tenant.whatsapp_number}?text=${encodeURIComponent(
                                `Halo ${tenant.name}, saya ingin konsultasi pesanan buket bunga.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-sage-600 hover:bg-sage-700 text-white rounded-2xl text-xs font-semibold shadow-xs hover:shadow-sm transition-all"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>Konsultasi via WhatsApp</span>
                        </a>
                        <span className="text-[11px] text-stone-600 hidden sm:inline">
                            Respons cepat: 08:00 - 21:00 WIB
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
