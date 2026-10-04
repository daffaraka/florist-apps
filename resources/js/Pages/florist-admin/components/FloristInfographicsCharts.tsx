import React from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';

interface InfographicsProps {
    top_bouquets: Array<{ name: string; sold: number; price: number; profit: number }>;
    sales_trend: Array<{ date: string; revenue: number; profit: number }>;
    occasion_distribution: Array<{ name: string; count: number }>;
}

const DOFF_COLORS = ['#7E9A7B', '#C87D65', '#D98E87', '#CADAC8', '#6B705C'];

export default function FloristInfographicsCharts({ infographics }: { infographics: InfographicsProps }) {
    const formatCurrency = (val: number) => {
        return `Rp ${(val / 1000).toLocaleString('id-ID')}k`;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* 1. Tren Penjualan Harian (Area Chart 2 Kolom di Desktop) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-doff-border shadow-sm flex flex-col justify-between">
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-doff-charcoal">Tren Omzet & Laba Bersih (7 Hari Terakhir)</h3>
                    <p className="text-xs text-doff-muted">Perbandingan nilai penjualan dengan profit kotor</p>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={infographics.sales_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7E9A7B" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#7E9A7B" stopOpacity={0.0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" stroke="#6B705C" fontSize={11} tickLine={false} />
                            <YAxis stroke="#6B705C" fontSize={11} tickLine={false} tickFormatter={formatCurrency} />
                            <Tooltip 
                                formatter={(value: any) => [`Rp ${Number(value || 0).toLocaleString('id-ID')}`, 'Nilai']}
                                contentStyle={{ backgroundColor: '#FAF8F5', borderRadius: '12px', border: '1px solid #E8E5DE', fontSize: '12px' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#658062" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="Omzet" />
                            <Area type="monotone" dataKey="profit" stroke="#C87D65" strokeWidth={2} fill="transparent" name="Laba Bersih" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. Distribusi Occasion Momen (Donut Pie Chart di Desktop) */}
            <div className="bg-white p-6 rounded-2xl border border-doff-border shadow-sm flex flex-col justify-between">
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-doff-charcoal">Distribusi Momen (Occasion)</h3>
                    <p className="text-xs text-doff-muted">Komposisi tema bouket yang diminati</p>
                </div>
                <div className="h-56 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={infographics.occasion_distribution}
                                dataKey="count"
                                nameKey="name"
                                innerRadius={45}
                                outerRadius={75}
                                paddingAngle={4}
                            >
                                {infographics.occasion_distribution.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={DOFF_COLORS[index % DOFF_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#FAF8F5', borderRadius: '12px', border: '1px solid #E8E5DE', fontSize: '12px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-doff-border/50">
                    {infographics.occasion_distribution.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-doff-muted">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DOFF_COLORS[idx % DOFF_COLORS.length] }}></span>
                            <span>{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Top 5 Bouket Terlaris (Bar Chart Horisontal / Vertikal) */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-doff-border shadow-sm">
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-doff-charcoal">Top Bouket Terfavorit</h3>
                    <p className="text-xs text-doff-muted">Produk yang paling banyak dipesan dan kontribusi margin</p>
                </div>
                <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={infographics.top_bouquets} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                            <XAxis type="number" stroke="#6B705C" fontSize={11} tickLine={false} />
                            <YAxis dataKey="name" type="category" stroke="#6B705C" fontSize={11} tickLine={false} width={140} />
                            <Tooltip 
                                formatter={(value: any) => [`${value} Terjual`, 'Pesanan']}
                                contentStyle={{ backgroundColor: '#FAF8F5', borderRadius: '12px', border: '1px solid #E8E5DE', fontSize: '12px' }}
                            />
                            <Bar dataKey="sold" fill="#7E9A7B" radius={[0, 6, 6, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
