import React from 'react';
import { usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Flower2, 
    PackageOpen, 
    CalendarClock, 
    WalletCards, 
    Layers,
    Tag,
    Scale,
    PanelLeftClose,
    PanelLeft
} from 'lucide-react';
import SidebarHeader from './SidebarHeader';
import SidebarNavList, { SidebarNavItem } from './SidebarNavList';
import SidebarUserProfile from './SidebarUserProfile';

interface FloristSidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export default function AdminSidebar({ isCollapsed, onToggle }: FloristSidebarProps) {
    const { url } = usePage();

    const navItems: SidebarNavItem[] = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Inventori & Bahan', href: '/admin/inventory', icon: Flower2 },
        { name: 'Katalog Bouket', href: '/admin/bouquets', icon: PackageOpen },
        { name: 'Jadwal Pesanan', href: '/admin/orders', icon: CalendarClock },
        { name: 'Keuangan & Laba', href: '/admin/finance', icon: WalletCards },
        { 
            name: 'Master Data', 
            href: '/admin/master-data', 
            icon: Layers,
            subItems: [
                { name: 'Kategori Bahan', href: '/admin/master-data?tab=categories', icon: Tag },
                { name: 'Satuan Pengukuran', href: '/admin/master-data?tab=units', icon: Scale },
            ],
        },
    ];

    return (
        <aside 
            className={`bg-doff-dark border-r border-doff-darker text-white flex flex-col shadow-lg transition-all duration-300 ease-in-out flex-shrink-0 z-30 ${
                isCollapsed ? 'w-20' : 'w-64 lg:w-72'
            }`}
        >
            {/* Header Brand & Toggle Buka-Tutup */}
            <SidebarHeader
                isCollapsed={isCollapsed}
                onToggle={onToggle}
                ToggleOpenIcon={PanelLeft}
                ToggleCloseIcon={PanelLeftClose}
            />

            {/* Navigasi Menu dengan Highlight Aktif Kontras Tinggi */}
            <SidebarNavList 
                items={navItems} 
                currentUrl={url} 
                isCollapsed={isCollapsed} 
            />

            {/* Profil Singkat Pengguna */}
            <SidebarUserProfile isCollapsed={isCollapsed} />
        </aside>
    );
}
