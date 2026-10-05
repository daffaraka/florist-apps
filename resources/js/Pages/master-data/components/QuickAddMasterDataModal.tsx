import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import axios from 'axios';
import { ItemCategory, UnitMeasurement } from '../../flower-inventory/types';

interface QuickAddModalProps {
    isOpen: boolean;
    type: 'category' | 'unit';
    onClose: () => void;
    onSuccessCategory?: (category: ItemCategory) => void;
    onSuccessUnit?: (unit: UnitMeasurement) => void;
}

export default function QuickAddMasterDataModal({
    isOpen,
    type,
    onClose,
    onSuccessCategory,
    onSuccessUnit,
}: QuickAddModalProps) {
    if (!isOpen) return null;

    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            if (type === 'category') {
                const response = await axios.post('/admin/master-data/quick-category', {
                    name,
                    description,
                });
                if (response.data?.category) {
                    onSuccessCategory?.(response.data.category);
                    onClose();
                }
            } else {
                const response = await axios.post('/admin/master-data/quick-unit', {
                    name,
                    symbol: symbol || name.toLowerCase().replace(/\s+/g, '_'),
                    description,
                });
                if (response.data?.unit) {
                    onSuccessUnit?.(response.data.unit);
                    onClose();
                }
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Gagal menyimpan data master.');
        } finally {
            setIsLoading(false);
        }
    };

    const isCategory = type === 'category';

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full border border-doff-border shadow-xl p-5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-doff-border">
                    <div className="flex items-center space-x-2 text-sage-700">
                        <Sparkles className="w-4 h-4 stroke-[2]" />
                        <h4 className="font-semibold text-sm text-doff-charcoal">
                            {isCategory ? 'Tambah Kategori Cepat' : 'Tambah Satuan Cepat'}
                        </h4>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-doff-muted hover:bg-doff-sand transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {errorMsg && (
                    <div className="mt-3 p-2.5 rounded-xl bg-terracotta-50 border border-terracotta-200 text-terracotta-700 text-xs">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-3.5 space-y-3 text-xs">
                    <div>
                        <label className="block font-medium text-doff-charcoal mb-1">
                            {isCategory ? 'Nama Kategori *' : 'Nama Satuan *'}
                        </label>
                        <input
                            type="text"
                            placeholder={isCategory ? 'Contoh: Dried Flower, Floral Foam' : 'Contoh: Ikat, Bunch, Box'}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-xs rounded-xl border border-doff-border px-3 py-2 focus:border-sage-500 focus:ring-0"
                            required
                            autoFocus
                        />
                    </div>

                    {!isCategory && (
                        <div>
                            <label className="block font-medium text-doff-charcoal mb-1">
                                Simbol / Kode Singkat *
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: bunch, ikat, box"
                                value={symbol}
                                onChange={(e) => setSymbol(e.target.value)}
                                className="w-full text-xs rounded-xl border border-doff-border px-3 py-2 font-mono focus:border-sage-500 focus:ring-0"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block font-medium text-doff-charcoal mb-1">
                            Catatan / Deskripsi (Opsional)
                        </label>
                        <input
                            type="text"
                            placeholder="Keterangan singkat..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full text-xs rounded-xl border border-doff-border px-3 py-2 focus:border-sage-500 focus:ring-0"
                        />
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-doff-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 rounded-xl text-xs font-medium text-doff-muted hover:bg-doff-sand transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-sage-600 hover:bg-sage-700 text-white shadow-xs transition-colors disabled:opacity-50"
                        >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>{isLoading ? 'Menyimpan...' : 'Simpan'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
