import React from 'react';
import { ItemCategory } from '../../flower-inventory/types';
import { Edit2, Trash2, ShieldCheck, Tag } from 'lucide-react';

interface CategoryListTableProps {
    categories: ItemCategory[];
    onEdit: (category: ItemCategory) => void;
    onDelete: (category: ItemCategory) => void;
}

export default function CategoryListTable({
    categories,
    onEdit,
    onDelete,
}: CategoryListTableProps) {
    return (
        <div className="bg-white rounded-2xl border border-doff-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-doff-sand/60 text-doff-muted border-b border-doff-border">
                        <tr>
                            <th className="px-5 py-3.5 font-medium">Nama Kategori</th>
                            <th className="px-4 py-3.5 font-medium">Slug Pengenal</th>
                            <th className="px-4 py-3.5 font-medium">Deskripsi / Catatan</th>
                            <th className="px-4 py-3.5 font-medium">Item Terkait</th>
                            <th className="px-5 py-3.5 font-medium text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-doff-border/70">
                        {categories.map((cat) => {
                            const isUsed = Number(cat.inventory_items_count || 0) > 0;

                            return (
                                <tr key={cat.id} className="hover:bg-doff-canvas/60 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center space-x-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-sage-50 text-sage-700 flex items-center justify-center shrink-0 border border-sage-200">
                                                <Tag className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold text-doff-charcoal text-sm">
                                                        {cat.name}
                                                    </span>
                                                    {cat.is_default && (
                                                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-sand-50 text-sand-800 border border-sand-200">
                                                            <ShieldCheck className="w-3 h-3 text-sand-600" />
                                                            <span>Bawaan</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 font-mono text-[11px] text-doff-muted">
                                        {cat.slug}
                                    </td>

                                    <td className="px-4 py-4 text-doff-muted max-w-xs truncate">
                                        {cat.description || '-'}
                                    </td>

                                    <td className="px-4 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                                isUsed
                                                    ? 'bg-sage-50 text-sage-800 border border-sage-200'
                                                    : 'bg-doff-sand/80 text-doff-muted'
                                            }`}
                                        >
                                            {cat.inventory_items_count || 0} bahan
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 text-right">
                                        <div className="inline-flex items-center space-x-1.5">
                                            <button
                                                onClick={() => onEdit(cat)}
                                                className="p-1.5 rounded-lg text-doff-muted hover:text-sage-700 hover:bg-sage-50 transition-colors"
                                                title="Edit Kategori"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>

                                            <button
                                                onClick={() => onDelete(cat)}
                                                disabled={isUsed}
                                                className={`p-1.5 rounded-lg transition-colors ${
                                                    isUsed
                                                        ? 'text-doff-border cursor-not-allowed'
                                                        : 'text-doff-muted hover:text-terracotta-600 hover:bg-terracotta-50'
                                                }`}
                                                title={
                                                    isUsed
                                                        ? 'Kategori tidak dapat dihapus karena masih digunakan item inventori'
                                                        : 'Hapus Kategori'
                                                }
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
