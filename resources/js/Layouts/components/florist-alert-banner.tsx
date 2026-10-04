import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type AlertType = 'success' | 'warning' | 'info';

interface FloristAlertBannerProps {
    type?: AlertType;
    message: string;
    onClose?: () => void;
}

export default function FloristAlertBanner({ type = 'info', message, onClose }: FloristAlertBannerProps) {
    if (!message) return null;

    const styles = {
        success: {
            bg: 'bg-sage-50 border-sage-200 text-sage-800',
            icon: CheckCircle2,
            iconColor: 'text-sage-600',
        },
        warning: {
            bg: 'bg-terracotta-50 border-terracotta-100 text-terracotta-700',
            icon: AlertTriangle,
            iconColor: 'text-terracotta-500',
        },
        info: {
            bg: 'bg-doff-sand border-doff-border text-doff-charcoal',
            icon: Info,
            iconColor: 'text-doff-muted',
        },
    };

    const currentStyle = styles[type];
    const Icon = currentStyle.icon;

    return (
        <div className={`flex items-center justify-between p-3.5 mb-6 rounded-xl border shadow-xs text-xs font-medium ${currentStyle.bg}`}>
            <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 stroke-[1.8] flex-shrink-0 ${currentStyle.iconColor}`} />
                <span>{message}</span>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="p-1 rounded-md hover:bg-black/5 text-doff-muted hover:text-doff-charcoal transition-colors ml-3"
                >
                    <X className="w-3.5 h-3.5 stroke-[2]" />
                </button>
            )}
        </div>
    );
}
