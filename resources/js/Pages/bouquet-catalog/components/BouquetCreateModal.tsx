import React, { useState, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Upload, Sparkles } from 'lucide-react';
import { InventoryItemOption, OccasionItem } from '../types';
import BouquetCompositionBuilder, { SelectedComposition } from './BouquetCompositionBuilder';
import BouquetPriceSummaryCard from './BouquetPriceSummaryCard';

interface BouquetCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableItems: InventoryItemOption[];
    occasions: OccasionItem[];
}

export default function BouquetCreateModal({
    isOpen,
    onClose,
    availableItems,
    occasions,
}: BouquetCreateModalProps) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        selling_price: 0,
        is_ready_stock: true,
        is_active: true,
        is_featured: false,
        photo: null as File | null,
        occasion_ids: [] as number[],
        compositions: [] as SelectedComposition[],
    });

    const calculatedCogs = useMemo(() => {
        return data.compositions.reduce((total, comp) => {
            const item = availableItems.find((i) => i.id === comp.inventory_item_id);
            return total + (item ? item.unit_cost * comp.required_quantity : 0);
        }, 0);
    }, [data.compositions, availableItems]);

    if (!isOpen) return null;

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const toggleOccasion = (id: number) => {
        setData(
            'occasion_ids',
            data.occasion_ids.includes(id)
                ? data.occasion_ids.filter((item) => item !== id)
                : [...data.occasion_ids, id]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/bouquets', {
            onSuccess: () => {
                reset();
                setPhotoPreview(null);
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-doff-dark/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white border border-doff-border rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl my-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-doff-border flex items-center justify-between bg-doff-sand/40 rounded-t-2xl">
                    <h3 className="font-bold text-doff-charcoal text-base">
                        Tambah Buket Baru & Resep Bahan
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-doff-muted hover:text-doff-charcoal hover:bg-doff-border/50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-doff-charcoal mb-1">
                                Nama / Judul Buket *
                            </label>
                            <input
                                type="text"
                                required
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Contoh: Whispering Rose Deluxe"
                                className="w-full text-xs bg-white border border-doff-border rounded-lg p-2.5 focus:ring-1 focus:ring-sage-500"
                            />
                            {errors.title && <p className="text-xs text-blush-600 mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-doff-charcoal mb-1">
                                Harga Jual (IDR) *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={data.selling_price || ''}
                                onChange={(e) => setData('selling_price', Number(e.target.value))}
                                placeholder="Rp 250.000"
                                className="w-full text-xs bg-white border border-doff-border rounded-lg p-2.5 focus:ring-1 focus:ring-sage-500"
                            />
                            {errors.selling_price && <p className="text-xs text-blush-600 mt-1">{errors.selling_price}</p>}
                        </div>

                        {/* Foto Buket */}
                        <div>
                            <label className="block text-xs font-semibold text-doff-charcoal mb-1">
                                Foto Buket
                            </label>
                            <div className="flex items-center gap-3">
                                {photoPreview && (
                                    <img
                                        src={photoPreview}
                                        alt="Preview"
                                        className="w-10 h-10 rounded-lg object-cover border border-doff-border"
                                    />
                                )}
                                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 border border-dashed border-doff-border rounded-lg p-2 text-xs text-doff-muted hover:border-sage-400 bg-doff-sand/20">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Pilih Gambar</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            {errors.photo && <p className="text-xs text-blush-600 mt-1">{errors.photo}</p>}
                        </div>
                    </div>

                    {/* Occasion Tags */}
                    <div>
                        <label className="block text-xs font-semibold text-doff-charcoal mb-1.5">
                            Kategori Momen / Occasion
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {occasions.map((occ) => {
                                const selected = data.occasion_ids.includes(occ.id);
                                return (
                                    <button
                                        key={occ.id}
                                        type="button"
                                        onClick={() => toggleOccasion(occ.id)}
                                        className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                                            selected
                                                ? 'bg-sage-100 border-sage-300 text-sage-800 font-medium'
                                                : 'bg-white border-doff-border text-doff-muted hover:border-sage-200'
                                        }`}
                                    >
                                        {occ.emoji} {occ.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Toggles */}
                    <div className="flex flex-wrap gap-4 p-3 bg-doff-sand/40 border border-doff-border rounded-xl text-xs">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_ready_stock}
                                onChange={(e) => setData('is_ready_stock', e.target.checked)}
                                className="rounded border-doff-border text-sage-600 focus:ring-sage-500"
                            />
                            <span className="text-doff-charcoal">Ready Stock (Kirim Hari Ini)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_featured}
                                onChange={(e) => setData('is_featured', e.target.checked)}
                                className="rounded border-doff-border text-sage-600 focus:ring-sage-500"
                            />
                            <span className="text-doff-charcoal flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
                                Pin Unggulan (Featured)
                            </span>
                        </label>
                    </div>
                    {errors.is_featured && <p className="text-xs text-blush-600">{errors.is_featured}</p>}

                    {/* Visual BOM Composition Builder */}
                    <BouquetCompositionBuilder
                        availableItems={availableItems}
                        selectedCompositions={data.compositions}
                        onChange={(comps) => setData('compositions', comps)}
                    />
                    {errors.compositions && (
                        <p className="text-xs text-blush-600">{errors.compositions}</p>
                    )}

                    {/* Price & Margin Summary */}
                    <BouquetPriceSummaryCard
                        sellingPrice={data.selling_price}
                        estimatedCogs={calculatedCogs}
                    />

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-doff-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-doff-charcoal bg-white hover:bg-doff-sand border border-doff-border shadow-xs hover:border-doff-muted/40 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing || data.compositions.length === 0}
                            className="px-5 py-2 rounded-xl text-xs font-semibold bg-sage-600 hover:bg-sage-700 text-white shadow-sm disabled:opacity-50 transition-colors"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Buket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
