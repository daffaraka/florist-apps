import React from 'react';
import { InventoryCategory } from '../types';
import { Sparkles, Info, ShieldAlert } from 'lucide-react';

interface InventoryCreateSidebarProps {
    data: {
        name: string;
        category: InventoryCategory;
        unit_cost: string;
        stock_quantity: string;
        unit_measurement: string;
        minimum_alert_stock: string;
        shelf_life_days: string;
    };
}

export default function InventoryCreateSidebar({ data }: InventoryCreateSidebarProps) {
    const unitCostNum = parseFloat(data.unit_cost) || 0;
    const stockQtyNum = parseFloat(data.stock_quantity) || 0;
    const totalAssetValuation = unitCostNum * stockQtyNum;

    const categoryNames: Record<InventoryCategory, string> = {
        fresh_flower: 'Bunga Segar (Fresh Flower)',
        wrapping_paper: 'Kertas Wrapping (Paper)',
        ribbon: 'Pita Satin (Ribbon)',
        accessory: 'Aksesoris / Boneka',
        greeting_card: 'Kartu Ucapan',
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div className="space-y-6">
            {/* Kartu Ringkasan Real-time */}
            <div className="bg-white rounded-2xl border border-doff-border p-5 shadow-2xs">
                <div className="flex items-center space-x-2 text-sage-700 mb-4 pb-3 border-b border-doff-border">
                    <Sparkles className="w-4 h-4 stroke-[2]" />
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-doff-charcoal">
                        Pratinjau Aset & Valuasi
                    </h4>
                </div>

                <div className="space-y-3.5 text-xs">
                    <div>
                        <span className="text-doff-muted block text-[11px] mb-0.5">Nama Terdaftar</span>
                        <p className="font-medium text-doff-charcoal truncate">
                            {data.name || 'Belum diisi'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-doff-border/50">
                        <div>
                            <span className="text-doff-muted block text-[11px] mb-0.5">Kategori</span>
                            <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-sage-50 text-sage-800 border border-sage-200">
                                {categoryNames[data.category] || data.category}
                            </span>
                        </div>
                        <div>
                            <span className="text-doff-muted block text-[11px] mb-0.5">Satuan</span>
                            <span className="font-medium text-doff-charcoal">
                                {data.unit_measurement}
                            </span>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-doff-border/50">
                        <span className="text-doff-muted block text-[11px] mb-0.5">Total Estimasi Nilai Modal</span>
                        <p className="text-base font-bold text-sage-800">
                            {formatCurrency(totalAssetValuation)}
                        </p>
                        <p className="text-[10px] text-doff-muted mt-0.5">
                            {stockQtyNum} {data.unit_measurement} × {formatCurrency(unitCostNum)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Kartu Panduan Operasional Florist */}
            <div className="bg-doff-sand/40 rounded-2xl border border-doff-border p-5 space-y-3 text-xs">
                <div className="flex items-center space-x-2 text-doff-charcoal">
                    <Info className="w-4 h-4 text-sage-600" />
                    <h4 className="font-semibold text-xs">Panduan Workshop Florist</h4>
                </div>
                <ul className="space-y-2 text-[11px] text-doff-muted leading-relaxed list-disc list-inside">
                    <li>
                        <strong className="text-doff-charcoal">Harga Modal (HPP):</strong> Digunakan otomatis saat merangkai resep buket untuk menghitung margin keuntungan kotor.
                    </li>
                    <li>
                        <strong className="text-doff-charcoal">Batas Min Alert:</strong> Jika stok di bawah batas ini, sistem akan memunculkan alarm kulakan di dashboard.
                    </li>
                    {data.category === 'fresh_flower' && (
                        <li>
                            <strong className="text-doff-charcoal">Masa Kesegaran Chiller:</strong> Pantau masa simpan agar bunga dapat dirangkai sebelum layu alami.
                        </li>
                    )}
                </ul>
            </div>

            {/* Kartu Kebijakan Susut & Waste */}
            <div className="bg-terracotta-50/50 rounded-2xl border border-terracotta-100 p-4 flex items-start space-x-3 text-xs">
                <ShieldAlert className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-terracotta-800 leading-relaxed">
                    <span className="font-semibold block mb-0.5">Pencatatan Bunga Layu Terintegrasi</span>
                    Setelah bahan terdaftar, setiap tangkai rusak atau layu dapat dipotong langsung melalui aksi <em>Single-Tap Waste</em> di halaman daftar inventori.
                </div>
            </div>
        </div>
    );
}
