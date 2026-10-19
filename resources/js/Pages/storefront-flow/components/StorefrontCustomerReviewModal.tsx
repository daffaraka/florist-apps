import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Star, Upload, ShieldCheck, Heart } from 'lucide-react';

interface StorefrontCustomerReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function StorefrontCustomerReviewModal({
    isOpen,
    onClose,
}: StorefrontCustomerReviewModalProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        order_number: '',
        customer_name: '',
        rating: 5,
        review_text: '',
        photo: null as File | null,
    });

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/store/reviews', {
            onSuccess: () => {
                reset();
                setPreviewUrl(null);
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative max-w-lg w-full bg-white rounded-3xl shadow-2xl p-6 border border-stone-100 my-8">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                    <div>
                        <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sage-50 text-sage-800 border border-sage-200 mb-1">
                            <ShieldCheck className="w-3 h-3 text-sage-600" />
                            <span>Ulasan Pesanan Terverifikasi</span>
                        </div>
                        <h3 className="text-base font-bold text-stone-900 font-serif">Bagikan Cerita Bahagia Anda</h3>
                        <p className="text-xs text-stone-600 mt-0.5">Ulasan dan foto Anda sangat berarti untuk studio bunga kami</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-stone-600 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Input */}
                <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Nomor Pesanan */}
                        <div>
                            <label className="block font-semibold text-stone-700 mb-1">Nomor Pesanan *</label>
                            <input
                                type="text"
                                required
                                value={data.order_number}
                                onChange={(e) => setData('order_number', e.target.value)}
                                placeholder="cth. ORD-XXXXXX"
                                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all text-xs"
                            />
                            {errors.order_number && (
                                <p className="text-rose-500 text-[11px] mt-1">{errors.order_number}</p>
                            )}
                        </div>

                        {/* Nama Pembeli */}
                        <div>
                            <label className="block font-semibold text-stone-700 mb-1">Nama Anda *</label>
                            <input
                                type="text"
                                required
                                value={data.customer_name}
                                onChange={(e) => setData('customer_name', e.target.value)}
                                placeholder="cth. Rina A. / Dimas"
                                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all text-xs"
                            />
                            {errors.customer_name && (
                                <p className="text-rose-500 text-[11px] mt-1">{errors.customer_name}</p>
                            )}
                        </div>
                    </div>

                    {/* Rating Bintang */}
                    <div>
                        <label className="block font-semibold text-stone-700 mb-1">Rating Kepuasan *</label>
                        <div className="flex items-center space-x-2 py-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setData('rating', star)}
                                    className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                                >
                                    <Star
                                        className={`w-6 h-6 ${
                                            star <= data.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                                        }`}
                                    />
                                </button>
                            ))}
                            <span className="text-xs font-bold text-stone-700 ml-2">{data.rating} dari 5 Bintang</span>
                        </div>
                    </div>

                    {/* Komentar */}
                    <div>
                        <label className="block font-semibold text-stone-700 mb-1">Cerita & Kesan Anda *</label>
                        <textarea
                            required
                            rows={3}
                            value={data.review_text}
                            onChange={(e) => setData('review_text', e.target.value)}
                            placeholder="Bagaimana kesegaran bunga, ketepatan waktu kurir, atau kebahagiaan penerima?"
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all text-xs leading-relaxed"
                        />
                        {errors.review_text && (
                            <p className="text-rose-500 text-[11px] mt-1">{errors.review_text}</p>
                        )}
                    </div>

                    {/* Unggah Foto Bunga yang Tiba */}
                    <div>
                        <label className="block font-semibold text-stone-700 mb-1">Foto Buket yang Anda Terima (Opsional)</label>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border border-dashed border-stone-300 hover:border-sage-500 bg-stone-50/70 hover:bg-sage-50/50 cursor-pointer transition-colors text-stone-600">
                                <Upload className="w-4 h-4 text-sage-600" />
                                <span className="font-medium text-xs">Unggah Foto Bunga</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                            {previewUrl && (
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-200">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-stone-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-stone-600 hover:text-stone-800 font-medium rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-xl font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-60"
                        >
                            {processing ? 'Mengirim...' : 'Kirim Ulasan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
