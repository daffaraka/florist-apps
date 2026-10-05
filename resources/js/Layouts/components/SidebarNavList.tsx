import React from 'react';
import { Link } from '@inertiajs/react';
import { LucideIcon, ChevronDown } from 'lucide-react';

export interface SidebarSubItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

export interface SidebarNavItem {
    name: string;
    href: string;
    icon: LucideIcon;
    subItems?: SidebarSubItem[];
}

interface SidebarNavListProps {
    items: SidebarNavItem[];
    currentUrl: string;
    isCollapsed: boolean;
}

export default function SidebarNavList({ items, currentUrl, isCollapsed }: SidebarNavListProps) {
    // State untuk toggle submenu (default terbuka jika URL berada di master-data)
    const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        items.forEach((item) => {
            if (item.subItems && currentUrl.startsWith(item.href)) {
                initial[item.name] = true;
            }
        });
        return initial;
    });

    const toggleSubMenu = (menuName: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menuName]: !prev[menuName],
        }));
    };

    return (
        <nav className="p-3 space-y-1.5 flex-1">
            {items.map((item) => {
                const Icon = item.icon;
                const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
                const isParentActive = currentUrl.startsWith(item.href);
                const isOpen = openMenus[item.name] ?? isParentActive;

                if (hasSubItems && !isCollapsed) {
                    return (
                        <div key={item.name} className="space-y-1">
                            {/* Header Menu dengan Tombol Toggle Accordion */}
                            <div
                                className={`flex items-center justify-between rounded-xl text-sm transition-all duration-150 px-3.5 py-2.5 cursor-pointer select-none ${
                                    isParentActive
                                        ? 'bg-white/10 text-white font-semibold'
                                        : 'text-sage-100/75 hover:bg-white/10 hover:text-white font-normal'
                                }`}
                                onClick={() => toggleSubMenu(item.name)}
                            >
                                <div className="flex items-center space-x-3 truncate">
                                    <Icon
                                        className={`w-5 h-5 stroke-[1.8] flex-shrink-0 transition-colors ${
                                            isParentActive ? 'text-sage-300' : 'text-sage-300/80 group-hover:text-white'
                                        }`}
                                    />
                                    <span className="truncate">{item.name}</span>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 text-sage-300/70 transition-transform duration-200 ${
                                        isOpen ? 'rotate-180' : 'rotate-0'
                                    }`}
                                />
                            </div>

                            {/* Submenu Accordion Container */}
                            {isOpen && (
                                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-white/15 ml-4.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                    {item.subItems?.map((sub) => {
                                        const SubIcon = sub.icon;
                                        // Cek aktif berdasarkan URL persis atau query tab
                                        const isSubActive =
                                            currentUrl === sub.href ||
                                            (sub.href === '/admin/master-data?tab=categories' &&
                                                (currentUrl === '/admin/master-data' ||
                                                    currentUrl === '/admin/master-data?tab=categories')) ||
                                            (sub.href === '/admin/master-data?tab=units' &&
                                                currentUrl === '/admin/master-data?tab=units');

                                        return (
                                            <Link
                                                key={sub.href}
                                                href={sub.href}
                                                className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                                                    isSubActive
                                                        ? 'bg-sage-500 text-white font-semibold shadow-xs'
                                                        : 'text-sage-200/75 hover:bg-white/10 hover:text-white font-medium'
                                                }`}
                                            >
                                                <SubIcon className="w-3.5 h-3.5 stroke-[2] flex-shrink-0 opacity-80" />
                                                <span className="truncate">{sub.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                }

                // Normal Item atau saat Sidebar Collapsed
                const isActive = currentUrl.startsWith(item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        title={isCollapsed ? item.name : undefined}
                        className={`flex items-center rounded-xl text-sm transition-all duration-150 ${
                            isCollapsed ? 'justify-center px-2 py-3' : 'px-3.5 py-2.5 space-x-3'
                        } ${
                            isActive
                                ? 'bg-sage-500 text-white font-semibold shadow-md shadow-sage-900/30'
                                : 'text-sage-100/75 hover:bg-white/10 hover:text-white font-normal'
                        }`}
                    >
                        <Icon
                            className={`w-5 h-5 stroke-[1.8] flex-shrink-0 transition-colors ${
                                isActive ? 'text-white' : 'text-sage-300/80 group-hover:text-white'
                            }`}
                        />
                        {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                );
            })}
        </nav>
    );
}
