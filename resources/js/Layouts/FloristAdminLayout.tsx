import React, { ReactNode, useState } from 'react';
import FloristAdminSidebar from './components/florist-admin-sidebar';
import FloristAdminHeader from './components/florist-admin-header';

interface FloristAdminLayoutProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export default function FloristAdminLayout({ title, subtitle, children }: FloristAdminLayoutProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-doff-canvas text-doff-charcoal flex flex-col md:flex-row antialiased selection:bg-sage-200">
            {/* 1. Modular Sidebar dengan Toggle Buka-Tutup & Active Highlight */}
            <FloristAdminSidebar 
                isCollapsed={isSidebarCollapsed} 
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            />

            {/* 2. Area Konten Utama */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {/* Modular Header */}
                <FloristAdminHeader title={title} subtitle={subtitle} />

                {/* Halaman / Children Container */}
                <div className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
