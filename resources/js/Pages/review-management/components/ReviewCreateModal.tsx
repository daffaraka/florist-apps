import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Star, Upload, Sparkles, Image as ImageIcon } from 'lucide-react';
import { BouquetOption } from '../types';

interface ReviewCreateModalProps {
    isOpen: boolean;
    availableBouquets: BouquetOption[];
    onClose: () => void;
}

export default function ReviewCreateModal({
    isOpen,
    availableBouquets,
    onClose,
}: ReviewCreateModalProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: '',
        customer_handle: 'Via WhatsApp',
        bouquet_id: '',
        rating: 5,
        review_text: '',
        review_date: new Date().toISOString().slice(0, 10),
        is_featured: false,
        is_published: true,
        photo: null as File | null,
        photo_url: '',
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
        post('/admin/reviews', {
            onSuccess: () => {
                reset();
                setPreviewUrl(null);
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative max-w-xl w-full bg-white rounded-3xl shadow-2xl p-6 border border-stone-100 my-8">
                {/* Header Modal */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                    <div>
                        <h3 className="text-base font-bold text-stone-900">Tambah Ulasan Manual (Kurasi Admin)</h3>
                        <p className="text-xs text-stone-600 mt-0.5">Unggah testimoni chat WhatsApp atau foto buket asli pelanggan</p>
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
                        {/* Nama Pelanggan */}
                        <div>
                            <label className="block font-semibold text-stone-700 mb-1">Nama Pelanggan *</label>
                            <input
                                type="text"
                                required
                                value={data.customer_name}
                                onChange={(e) => setData('customer_name', e.target.value)}
                                placeholder="cth. Nadia S. / Kak Kevin"
                                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all text-xs"
                            />
                            {errors.customer_name && <p className="text-rose-500 text-[11px] mt-1">{errors.customer_name}</p>}
                        </div>

                        {/* Sumber / Keterangan Acara */}
                        <div>
                            <label className="block font-semibold text-stone-700 mb-1">Keterangan / Sumber</label>
                            <input
                                type="text"
                                value={data.customer_handle}
                                onChange={(e) => setData('customer_handle', e.target.value)}
                                placeholder="cth. Via WhatsApp • Wisuda UGM"
                                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all text-xs"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Buket Terkait */}
                        <div>
                            <label className="block font-semibold text-stone-700 mb-1">Buket yang Diulas (Opsional)</label>
                            <select
                                value={data.bouquet_id}
                                onChange={(e) => setData('bouquet_id', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all text-xs bg-white cursor-pointer"
                            >
                                <option value="">-- Toko Umum (Tidak terkait buket tertentu) --</option>
                                {availableBouquets.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tanggal Ulasan */}
                        <div>
                            <label className="block font-semibold text-stone-700 mb-1">Tanggal Ulasan</label>
                            <input
                                type="date"
                                value={data.review_date}
                                onChange={(e) => setData('review_date', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all text-xs bg-white cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Rating Bintang Interaktif */}
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

                    {/* Teks Ulasan */}
                    <div>
                        <label className="block font-semibold text-stone-700 mb-1">Isi Testimoni / Komentar *</label>
                        <textarea
                            required
                            rows={3}
                            value={data.review_text}
                            onChange={(e) => setData('review_text', e.target.value)}
                            placeholder="Tuliskan pujian, kepuasan terhadap kesegaran bunga, kecepatan respon, dsb..."
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all text-xs leading-relaxed"
                        />
                        {errors.review_text && <p className="text-rose-500 text-[11px] mt-1">{errors.review_text}</p>}
                    </div>

                    {/* Upload Foto Testimoni / Screenshot Chat */}
                    <div>
                        <label className="block font-semibold text-stone-700 mb-1">Foto Buket / Screenshot Chat WA (Opsional)</label>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border border-dashed border-stone-300 hover:border-sage-500 bg-stone-50/70 hover:bg-sage-50/50 cursor-pointer transition-colors text-stone-600">
                                <Upload className="w-4 h-4 text-sage-600" />
                                <span className="font-medium text-xs">Pilih Foto (Maks 3MB)</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                            {previewUrl && (
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-200">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Toggle Unggulan & Publikasi */}
                    <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-stone-100">
                        <label className="flex items-center space-x-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={data.is_featured}
                                onChange={(e) => setData('is_featured', e.target.checked)}
                                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                            />
                            <span className="font-medium text-stone-700">Tampilkan sebagai Ulasan Unggulan (Wall of Love)</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={data.is_published}
                                onChange={(e) => setData('is_published', e.target.checked)}
                                className="w-4 h-4 rounded text-sage-600 focus:ring-sage-500"
                            />
                            <span className="font-medium text-stone-700">Publikasikan Langsung ke Etalase</span>
                        </label>
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
                            {processing ? 'Menyimpan...' : 'Simpan Ulasan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
