import React from 'react';
import { Link } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

interface SidebarNavItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

interface SidebarNavListProps {
    items: SidebarNavItem[];
    currentUrl: string;
    isCollapsed: boolean;
}

export default function SidebarNavList({ items, currentUrl, isCollapsed }: SidebarNavListProps) {
    return (
        <nav className="p-3 space-y-1.5 flex-1">
            {items.map((item) => {
                const Icon = item.icon;
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
