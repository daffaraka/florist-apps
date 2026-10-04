import React from 'react';

interface SidebarUserProfileProps {
    isCollapsed: boolean;
}

export default function SidebarUserProfile({ isCollapsed }: SidebarUserProfileProps) {
    return (
        <div className="p-3 border-t border-white/10 bg-black/20">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                <div className="w-9 h-9 rounded-full bg-blush-500/20 border border-blush-400/40 flex items-center justify-center text-xs font-bold text-blush-300 flex-shrink-0">
                    SF
                </div>
                {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate text-white">Sarah Florist</p>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sage-500/30 text-sage-200 border border-sage-400/30">
                            Pro Plan
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
