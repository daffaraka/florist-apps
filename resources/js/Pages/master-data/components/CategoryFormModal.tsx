import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { router } from '@inertiajs/react';
import { ItemCategory } from '../../flower-inventory/types';

interface CategoryFormModalProps {
    isOpen: boolean;
    category: ItemCategory | null;
    onClose: () => void;
}

export default function CategoryFormModal({
    isOpen,
    category,
    onClose,
}: CategoryFormModalProps) {
    if (!isOpen) return null;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (category) {
            setName(category.name);
            setDescription(category.description || '');
        } else {
            setName('');
            setDescription('');
        }
    }, [category, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (category) {
            router.put(
                `/admin/master-data/categories/${category.id}`,
                { name, description },
                {
                    onSuccess: () => onClose(),
                    onFinish: () => setIsSubmitting(false),
                }
            );
        } else {
            router.post(
                '/admin/master-data/categories',
                { name, description },
                {
                    onSuccess: () => onClose(),
                    onFinish: () => setIsSubmitting(false),
                }
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full border border-doff-border shadow-xl p-6 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-doff-border">
                    <h3 className="font-semibold text-base text-doff-charcoal">
                        {category ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-doff-muted hover:bg-doff-sand"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
                    <div>
                        <label className="block font-medium text-doff-charcoal mb-1.5">
                            Nama Kategori *
                        </label>
                        <input
                            type="text"
                            placeholder="Contoh: Bunga Segar, Pot Keramik, Dry Flower"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-xs rounded-xl border border-doff-border px-3.5 py-2.5 focus:border-sage-500 focus:ring-0"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-doff-charcoal mb-1.5">
                            Deskripsi / Catatan
                        </label>
                        <textarea
                            placeholder="Keterangan singkat tentang kelompok bahan ini..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full text-xs rounded-xl border border-doff-border px-3.5 py-2.5 focus:border-sage-500 focus:ring-0"
                            rows={3}
                        />
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-3 border-t border-doff-border/60">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl font-semibold text-doff-muted hover:bg-doff-sand transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl font-semibold bg-sage-600 hover:bg-sage-700 text-white shadow-xs transition-colors disabled:opacity-50"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
