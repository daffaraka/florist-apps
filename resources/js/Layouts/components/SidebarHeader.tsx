import React from 'react';
import { LucideIcon } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

interface SidebarHeaderProps {
    isCollapsed: boolean;
    onToggle: () => void;
    ToggleOpenIcon: LucideIcon;
    ToggleCloseIcon: LucideIcon;
}

export default function SidebarHeader({
    isCollapsed,
    onToggle,
    ToggleOpenIcon,
    ToggleCloseIcon,
}: SidebarHeaderProps) {
    return (
        <div className="p-4 lg:p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
                <ApplicationLogo className="w-10 h-10 shadow-sm flex-shrink-0" />
                {!isCollapsed && (
                    <div className="truncate">
                        <h1 className="font-bold text-sm lg:text-base tracking-tight text-white truncate">
                            Bloom Artisan
                        </h1>
                        <p className="text-[11px] text-sage-200/70 truncate">Studio Florist Admin</p>
                    </div>
                )}
            </div>

            <button
                onClick={onToggle}
                title={isCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
                className="p-1.5 rounded-lg text-sage-200/60 hover:text-white hover:bg-white/10 transition-colors"
            >
                {isCollapsed ? (
                    <ToggleOpenIcon className="w-5 h-5 stroke-[1.75]" />
                ) : (
                    <ToggleCloseIcon className="w-5 h-5 stroke-[1.75]" />
                )}
            </button>
        </div>
    );
}
