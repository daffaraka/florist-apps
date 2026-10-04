import React from 'react';
import { PackageOpen } from 'lucide-react';
import { BouquetItem } from '../types';
import BouquetCatalogItemCard from './BouquetCatalogItemCard';

interface BouquetCatalogGridProps {
    bouquets: BouquetItem[];
    onEdit: (bouquet: BouquetItem) => void;
    onDelete: (bouquet: BouquetItem) => void;
    onToggle: (bouquet: BouquetItem, field: 'is_active' | 'is_ready_stock' | 'is_featured') => void;
}

export default function BouquetCatalogGrid({
    bouquets,
    onEdit,
    onDelete,
    onToggle,
}: BouquetCatalogGridProps) {
    if (bouquets.length === 0) {
        return (
            <div className="bg-white border border-doff-border rounded-2xl p-12 text-center text-doff-muted">
                <PackageOpen className="w-12 h-12 stroke-1 mx-auto mb-3 text-doff-muted/60" />
                <h4 className="font-semibold text-doff-charcoal text-base mb-1">
                    Belum Ada Buket di Katalog
                </h4>
                <p className="text-xs max-w-sm mx-auto">
                    Katalog buket masih kosong atau tidak ada buket yang sesuai dengan filter pencarian.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {bouquets.map((bouquet) => (
                <BouquetCatalogItemCard
                    key={bouquet.id}
                    bouquet={bouquet}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggle={onToggle}
                />
            ))}
        </div>
    );
}
