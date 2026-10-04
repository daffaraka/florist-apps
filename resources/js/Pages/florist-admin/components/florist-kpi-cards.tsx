import React from 'react';
import { DollarSign, TrendingUp, ShoppingBag, AlertTriangle } from 'lucide-react';

interface MetricProps {
    total_revenue: number;
    total_net_profit: number;
    orders_today: number;
    low_stock_count: number;
}

export default function FloristKpiCards({ metrics }: { metrics: MetricProps }) {
    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const cards = [
        {
            label: 'Total Omzet Penjualan',
            value: formatRupiah(metrics.total_revenue),
            sub: 'Akumulasi transaksi selesai',
            icon: DollarSign,
            accent: 'bg-sage-50 text-sage-700 border-sage-200',
        },
        {
            label: 'Estimasi Laba Bersih',
            value: formatRupiah(metrics.total_net_profit),
            sub: 'Omzet dikurangi HPP bahan',
            icon: TrendingUp,
            accent: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        },
        {
            label: 'Pesanan Masuk Hari Ini',
            value: `${metrics.orders_today} Order`,
            sub: 'Jadwal rangkaian aktif',
            icon: ShoppingBag,
            accent: 'bg-blush-50 text-blush-600 border-blush-200',
        },
        {
            label: 'Bahan Stok Kritis',
            value: `${metrics.low_stock_count} Item`,
            sub: 'Di bawah batas minimum',
            icon: AlertTriangle,
            accent: 'bg-terracotta-50 text-terracotta-600 border-terracotta-100',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                    <div 
                        key={idx} 
                        className="bg-white p-5 rounded-2xl border border-doff-border shadow-sm flex flex-col justify-between hover:border-sage-300 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-doff-muted">{card.label}</span>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${card.accent}`}>
                                <Icon className="w-4 h-4 stroke-[2]" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-doff-charcoal">{card.value}</h3>
                            <p className="text-[11px] text-doff-muted mt-1">{card.sub}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
