import React from 'react';
import { X } from 'lucide-react';

interface StorefrontPhotoLightboxModalProps {
    isOpen: boolean;
    photoUrl: string | null;
    caption: string;
    onClose: () => void;
}

export default function StorefrontPhotoLightboxModal({
    isOpen,
    photoUrl,
    caption,
    onClose,
}: StorefrontPhotoLightboxModalProps) {
    if (!isOpen || !photoUrl) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-3 border border-stone-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between pb-3 px-2 border-b border-stone-100">
                    <span className="text-xs font-semibold text-stone-800 truncate">{caption}</span>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-stone-600 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="mt-3 flex items-center justify-center bg-stone-900/5 rounded-2xl overflow-hidden max-h-[70vh]">
                    <img
                        src={photoUrl}
                        alt={caption}
                        className="max-h-[68vh] w-auto object-contain rounded-xl"
                    />
                </div>
            </div>
        </div>
    );
}
