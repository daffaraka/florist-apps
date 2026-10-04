import React from 'react';

interface BouquetPriceSummaryCardProps {
    sellingPrice: number;
    estimatedCogs: number;
}

export default function BouquetPriceSummaryCard({
    sellingPrice,
    estimatedCogs,
}: BouquetPriceSummaryCardProps) {
    const profit = Math.max(0, sellingPrice - estimatedCogs);
    const profitMargin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
    const isProfitable = sellingPrice >= estimatedCogs && sellingPrice > 0;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val || 0);
    };

    return (
        <div className="bg-sage-50/70 border border-sage-200/80 rounded-xl p-4 transition-all">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-doff-muted mb-3">
                Simulasi Modal & Estimasi Laba
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="bg-white/80 p-2.5 rounded-lg border border-doff-border">
                    <p className="text-xs text-doff-muted">Harga Jual</p>
                    <p className="font-bold text-doff-charcoal text-base">
                        {formatCurrency(sellingPrice)}
                    </p>
                </div>

                <div className="bg-white/80 p-2.5 rounded-lg border border-doff-border">
                    <p className="text-xs text-doff-muted">Total HPP Bahan</p>
                    <p className="font-semibold text-terracotta-600 text-base">
                        {formatCurrency(estimatedCogs)}
                    </p>
                </div>

                <div className="bg-white/80 p-2.5 rounded-lg border border-doff-border">
                    <p className="text-xs text-doff-muted">Estimasi Laba</p>
                    <p className={`font-semibold text-base ${isProfitable ? 'text-sage-700' : 'text-blush-600'}`}>
                        {formatCurrency(profit)}
                    </p>
                </div>

                <div className="bg-white/80 p-2.5 rounded-lg border border-doff-border">
                    <p className="text-xs text-doff-muted">Margin Keuntungan</p>
                    <p className={`font-bold text-base ${isProfitable ? 'text-sage-700' : 'text-blush-600'}`}>
                        {profitMargin.toFixed(1)}%
                    </p>
                </div>
            </div>

            {sellingPrice > 0 && estimatedCogs > sellingPrice && (
                <p className="text-xs text-blush-600 mt-2.5 font-medium">
                    Perhatian: Harga jual lebih rendah dari total HPP bahan baku.
                </p>
            )}
        </div>
    );
}
