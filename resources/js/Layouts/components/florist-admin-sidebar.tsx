import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Flower2, 
    PackageOpen, 
    CalendarClock, 
    WalletCards, 
    Store,
    PanelLeftClose,
    PanelLeft
} from 'lucide-react';

interface FloristSidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export default function FloristAdminSidebar({ isCollapsed, onToggle }: FloristSidebarProps) {
    const { url } = usePage();

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Inventori & Bahan', href: '/admin/inventory', icon: Flower2 },
        { name: 'Katalog Bouket', href: '/admin/bouquets', icon: PackageOpen },
        { name: 'Jadwal Pesanan', href: '/admin/orders', icon: CalendarClock },
        { name: 'Keuangan & Laba', href: '/admin/finance', icon: WalletCards },
    ];

    return (
        <aside 
            className={`bg-white border-r border-doff-border flex flex-col shadow-sm transition-all duration-300 ease-in-out flex-shrink-0 ${
                isCollapsed ? 'w-20' : 'w-64 lg:w-72'
            }`}
        >
            {/* Header Brand & Toggle */}
            <div className="p-4 lg:p-5 border-b border-doff-border flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-sage-700 shadow-inner flex-shrink-0">
                        <Store className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    {!isCollapsed && (
                        <div className="truncate">
                            <h1 className="font-semibold text-sm lg:text-base tracking-tight text-doff-charcoal truncate">
                                Bloom Artisan
                            </h1>
                            <p className="text-[11px] text-doff-muted truncate">Studio Florist Admin</p>
                        </div>
                    )}
                </div>

                {/* Tombol Toggle Buka-Tutup */}
                <button
                    onClick={onToggle}
                    title={isCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
                    className="p-1.5 rounded-lg text-doff-muted hover:text-doff-charcoal hover:bg-doff-sand transition-colors"
                >
                    {isCollapsed ? (
                        <PanelLeft className="w-5 h-5 stroke-[1.75]" />
                    ) : (
                        <PanelLeftClose className="w-5 h-5 stroke-[1.75]" />
                    )}
                </button>
            </div>

            {/* Menu Navigasi dengan Active State Highlight */}
            <nav className="p-3 space-y-1.5 flex-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = url.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={isCollapsed ? item.name : undefined}
                            className={`flex items-center rounded-xl text-sm transition-all ${
                                isCollapsed ? 'justify-center px-2 py-3' : 'px-3.5 py-2.5 space-x-3'
                            } ${
                                isActive
                                    ? 'bg-sage-50 text-sage-700 shadow-sm border border-sage-200/80 font-semibold'
                                    : 'text-doff-muted hover:bg-doff-sand/60 hover:text-doff-charcoal'
                            }`}
                        >
                            <Icon 
                                className={`w-5 h-5 stroke-[1.75] flex-shrink-0 ${
                                    isActive ? 'text-sage-700' : 'text-doff-muted'
                                }`} 
                            />
                            {!isCollapsed && <span className="truncate">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Mini di Bagian Bawah */}
            <div className="p-3 border-t border-doff-border bg-doff-sand/30">
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                    <div className="w-9 h-9 rounded-full bg-blush-100 border border-blush-200 flex items-center justify-center text-xs font-semibold text-blush-600 flex-shrink-0">
                        SF
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate text-doff-charcoal">Sarah Florist</p>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-sage-100 text-sage-700">
                                Pro Plan
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
