import React from 'react';
import { Link } from '@inertiajs/react';
import { AlertCircle, ArrowUpRight } from 'lucide-react';

interface LowStockItem {
    id: number;
    name: string;
    category: string;
    stock_quantity: number;
    unit_measurement: string;
    minimum_alert_stock: number;
}

export default function FloristLowStockAlertTable({ items }: { items: LowStockItem[] }) {
    if (items.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-doff-border text-center">
                <p className="text-xs text-sage-700 font-medium">Semua stok bahan bunga dan perlengkapan dalam kondisi aman.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-doff-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-doff-border flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-terracotta-500 stroke-[2]" />
                    <h3 className="text-sm font-semibold text-doff-charcoal">Peringatan Stok Kritis (Perlu Kulakan)</h3>
                </div>
                <Link 
                    href="/admin/inventory" 
                    className="text-xs text-sage-700 hover:text-sage-800 font-medium inline-flex items-center space-x-1"
                >
                    <span>Buka Inventori</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-doff-sand/50 text-doff-muted border-b border-doff-border">
                        <tr>
                            <th className="px-5 py-3 font-medium">Nama Bahan Baku</th>
                            <th className="px-5 py-3 font-medium">Kategori</th>
                            <th className="px-5 py-3 font-medium text-right">Sisa Stok</th>
                            <th className="px-5 py-3 font-medium text-right">Batas Min</th>
                            <th className="px-5 py-3 font-medium text-center">Aksi Cepat</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-doff-border/60">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-doff-canvas/60 transition-colors">
                                <td className="px-5 py-3.5 font-medium text-doff-charcoal">{item.name}</td>
                                <td className="px-5 py-3.5 text-doff-muted capitalize">{item.category.replace('_', ' ')}</td>
                                <td className="px-5 py-3.5 text-right font-semibold text-terracotta-600">
                                    {item.stock_quantity} {item.unit_measurement}
                                </td>
                                <td className="px-5 py-3.5 text-right text-doff-muted">
                                    {item.minimum_alert_stock} {item.unit_measurement}
                                </td>
                                <td className="px-5 py-3.5 text-center">
                                    <Link
                                        href="/admin/inventory"
                                        className="inline-flex px-3 py-1 rounded-lg bg-sage-50 text-sage-700 hover:bg-sage-100 font-medium border border-sage-200/60"
                                    >
                                        Restok
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
