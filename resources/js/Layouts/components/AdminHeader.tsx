import React from 'react';
import { Calendar } from 'lucide-react';

interface FloristHeaderProps {
    title: string;
    subtitle?: string;
}

export default function FloristAdminHeader({ title, subtitle }: FloristHeaderProps) {
    const todayFormatted = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-doff-border px-6 md:px-8 py-4 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-semibold text-doff-charcoal tracking-tight">{title}</h2>
                <p className="text-xs text-doff-muted mt-0.5">
                    {subtitle || 'Kelola operasional dan inventori toko bunga Anda'}
                </p>
            </div>
            
            <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-xs text-doff-muted bg-doff-sand/80 px-3.5 py-1.5 rounded-xl border border-doff-border shadow-xs">
                    <Calendar className="w-3.5 h-3.5 stroke-[1.8] text-sage-600" />
                    <span>{todayFormatted}</span>
                </div>
            </div>
        </header>
    );
}
