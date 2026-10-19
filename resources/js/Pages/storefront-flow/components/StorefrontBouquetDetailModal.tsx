import React, { useState } from 'react';
import { X, Star, Zap, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { StorefrontBouquet } from '../types';

interface StorefrontBouquetDetailModalProps {
    isOpen: boolean;
    bouquet: StorefrontBouquet | null;
    onClose: () => void;
    onOrderNow: (bouquet: StorefrontBouquet) => void;
    onViewPhoto: (photoUrl: string, caption: string) => void;
}

export default function StorefrontBouquetDetailModal({
    isOpen,
    bouquet,
    onClose,
    onOrderNow,
    onViewPhoto,
}: StorefrontBouquetDetailModalProps) {
    const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

    if (!isOpen || !bouquet) return null;

    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(bouquet.selling_price);

    return (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 my-6 flex flex-col max-h-[90vh]">
                {/* Header Modal dengan Foto & Judul */}
                <div className="relative aspect-16/9 w-full bg-stone-100 overflow-hidden flex-shrink-0">
                    {bouquet.photo_url ? (
                        <img
                            src={bouquet.photo_url}
                            alt={bouquet.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-600">
                            Foto belum tersedia
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 p-2 bg-stone-900/70 hover:bg-stone-900 text-white rounded-full transition-colors cursor-pointer backdrop-blur-xs"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-3">
                        {bouquet.is_ready_stock ? (
                            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-emerald-800 shadow-xs backdrop-blur-xs">
                                <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                                <span>Ready Stock — Kirim Hari Ini</span>
                            </span>
                        ) : (
                            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-white/95 text-stone-800 shadow-xs backdrop-blur-xs">
                                <Clock className="w-3.5 h-3.5 text-stone-600" />
                                <span>Pre-Order (PO)</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Konten Scrollable */}
                <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                        <div>
                            <h2 className="text-xl font-bold text-stone-900 font-serif">{bouquet.title}</h2>
                            <div className="flex items-center space-x-2 mt-1">
                                <div className="flex items-center text-amber-500">
                                    <Star className="w-4 h-4 fill-amber-400" />
                                    <span className="text-xs font-bold text-stone-800 ml-1">
                                        {bouquet.rating_average.toFixed(1)}
                                    </span>
                                </div>
                                <span className="text-xs text-stone-600">
                                    • {bouquet.reviews_count} Ulasan Pelanggan
                                </span>
                            </div>
                        </div>
                        <div className="text-xl sm:text-2xl font-extrabold text-stone-900">
                            {formattedPrice}
                        </div>
                    </div>

                    {/* Navigasi Tab */}
                    <div className="flex border-b border-stone-100">
                        <button
                            type="button"
                            onClick={() => setActiveTab('details')}
                            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                                activeTab === 'details'
                                    ? 'border-stone-900 text-stone-900'
                                    : 'border-transparent text-stone-600 hover:text-stone-700'
                            }`}
                        >
                            Detail & Komposisi Bahan
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
                                activeTab === 'reviews'
                                    ? 'border-stone-900 text-stone-900'
                                    : 'border-transparent text-stone-600 hover:text-stone-700'
                            }`}
                        >
                            <span>Ulasan & Foto Pembeli</span>
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-100 font-semibold">
                                {bouquet.reviews_count}
                            </span>
                        </button>
                    </div>

                    {/* Tab 1: Detail & Komposisi */}
                    {activeTab === 'details' && (
                        <div className="space-y-4 pt-1">
                            <div>
                                <h4 className="text-xs font-bold text-stone-800 mb-1">Deskripsi Buket</h4>
                                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                                    {bouquet.description || 'Rangkaian bunga segar berkelas dirancang khusus oleh florist profesional.'}
                                </p>
                            </div>

                            {/* Resep Bahan Baku / Bunga */}
                            {bouquet.compositions && bouquet.compositions.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-stone-800 mb-2">Bunga & Komposisi Perangkai:</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {bouquet.compositions.map((comp) => (
                                            <div
                                                key={comp.id}
                                                className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-xs"
                                            >
                                                <span className="text-stone-700 font-medium">
                                                    {comp.inventory_item?.name || 'Bunga / Material'}
                                                </span>
                                                <span className="text-stone-600 font-semibold">
                                                    {comp.required_quantity} {comp.inventory_item?.unit_measurement || 'tangkai'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 2: Ulasan Pembeli Spesifik Buket Ini */}
                    {activeTab === 'reviews' && (
                        <div className="space-y-3 pt-1">
                            {bouquet.recent_reviews && bouquet.recent_reviews.length > 0 ? (
                                bouquet.recent_reviews.map((rev) => (
                                    <div
                                        key={rev.id}
                                        className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/70 text-xs space-y-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="font-semibold text-stone-800">{rev.customer_name}</div>
                                            <div className="flex items-center text-amber-500">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400' : 'text-stone-200'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-stone-600 italic leading-relaxed">"{rev.review_text}"</p>
                                        {rev.photo_url && (
                                            <button
                                                type="button"
                                                onClick={() => onViewPhoto(rev.photo_url!, `Foto dari ${rev.customer_name}`)}
                                                className="flex items-center space-x-1.5 text-sage-700 hover:text-sage-800 font-semibold cursor-pointer"
                                            >
                                                <span>📷 Lihat Foto Kiriman Pelanggan</span>
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-stone-600 text-xs">
                                    Belum ada ulasan spesifik untuk buket ini. Jadilah yang pertama memberikan review!
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Modal Sticky: Pesan Buket Ini */}
                <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-800 rounded-xl hover:bg-stone-200/60 transition-colors cursor-pointer"
                    >
                        Tutup
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onOrderNow(bouquet);
                        }}
                        className="px-6 py-2.5 bg-sage-600 hover:bg-sage-700 text-white rounded-2xl text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                    >
                        <span>Lanjut Pesan via WhatsApp</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
