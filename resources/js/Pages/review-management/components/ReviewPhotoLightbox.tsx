import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface ReviewPhotoLightboxProps {
    isOpen: boolean;
    imageUrl: string | null;
    caption: string;
    onClose: () => void;
}

export default function ReviewPhotoLightbox({
    isOpen,
    imageUrl,
    caption,
    onClose,
}: ReviewPhotoLightboxProps) {
    if (!isOpen || !imageUrl) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-3 border border-stone-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between pb-3 px-2 border-b border-stone-100">
                    <span className="text-xs font-semibold text-stone-700 truncate">{caption}</span>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-stone-600 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="mt-3 flex items-center justify-center bg-stone-900/5 rounded-2xl overflow-hidden max-h-[70vh]">
                    <img
                        src={imageUrl}
                        alt={caption}
                        className="max-h-[68vh] w-auto object-contain rounded-xl"
                    />
                </div>
                <div className="pt-3 px-2 flex justify-end">
                    <a
                        href={imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs text-sage-600 hover:text-sage-700 font-medium"
                    >
                        <span>Buka ukuran asli</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>
        </div>
    );
}
