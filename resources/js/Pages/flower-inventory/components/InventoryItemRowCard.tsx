import React from 'react';
import { InventoryItem } from '../types';
import { AlertCircle, Edit2, Flame, Barcode } from 'lucide-react';

interface InventoryItemRowCardProps {
    item: InventoryItem;
    onQuickRestock: (item: InventoryItem) => void;
    onRecordWaste: (item: InventoryItem) => void;
}

export default function InventoryItemRowCard({
    item,
    onQuickRestock,
    onRecordWaste,
}: InventoryItemRowCardProps) {
    const isCritical = Number(item.stock_quantity) <= Number(item.minimum_alert_stock);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    const getUnitLabel = () => {
        if (typeof item.unit_measurement === 'object' && item.unit_measurement !== null) {
            return (item.unit_measurement as any).name || (item.unit_measurement as any).symbol || 'pcs';
        }
        return item.unit?.name || item.unit?.symbol || item.unit_measurement || 'pcs';
    };

    const getCategoryBadge = () => {
        if (item.item_category) {
            return {
                label: item.item_category.name,
                style: item.category === 'fresh_flower'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : item.category === 'wrapping_paper'
                    ? 'bg-sand-50 text-amber-800 border-amber-200'
                    : item.category === 'ribbon'
                    ? 'bg-blush-50 text-blush-700 border-blush-200'
                    : 'bg-sage-50 text-sage-800 border-sage-200',
            };
        }

        switch (item.category) {
            case 'fresh_flower':
                return { label: 'Bunga Segar', style: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
            case 'wrapping_paper':
                return { label: 'Wrapping', style: 'bg-sand-50 text-amber-800 border-amber-200' };
            case 'ribbon':
                return { label: 'Pita', style: 'bg-blush-50 text-blush-700 border-blush-200' };
            default:
                return { label: 'Aksesoris', style: 'bg-doff-sand text-doff-muted border-doff-border' };
        }
    };

    const badge = getCategoryBadge();

    return (
        <tr className="hover:bg-doff-canvas/60 transition-colors border-b border-doff-border/70 text-xs">
            {/* Nama & SKU/Barcode */}
            <td className="px-5 py-4">
                <div className="flex flex-col">
                    <span className="font-semibold text-doff-charcoal text-sm">{item.name}</span>
                    <div className="flex items-center space-x-2 mt-1 text-[11px] text-doff-muted">
                        {item.color && <span>Warna: {item.color}</span>}
                        {item.sku && <span>• SKU: {item.sku}</span>}
                        {item.barcode && (
                            <span className="inline-flex items-center space-x-0.5 text-sage-700 font-mono">
                                <Barcode className="w-3 h-3" />
                                <span>{item.barcode}</span>
                            </span>
                        )}
                    </div>
                </div>
            </td>

            {/* Kategori & Shelf-life */}
            <td className="px-4 py-4">
                <span className={`inline-flex px-2 py-0.5 rounded-md border text-[11px] font-medium ${badge.style}`}>
                    {badge.label}
                </span>
                {item.shelf_life_days && (
                    <p className="text-[10px] text-doff-muted mt-1">Kesegaran: ~{item.shelf_life_days} hari</p>
                )}
            </td>

            {/* Harga Modal (Unit Cost) */}
            <td className="px-4 py-4 font-medium text-doff-charcoal">
                {formatCurrency(Number(item.unit_cost))}
                <span className="text-[10px] text-doff-muted block">/{getUnitLabel()}</span>
            </td>

            {/* Jumlah Stok & Status */}
            <td className="px-4 py-4">
                <div className="flex items-center space-x-2">
                    <span className={`font-bold text-sm ${isCritical ? 'text-terracotta-600' : 'text-sage-700'}`}>
                        {Number(item.stock_quantity)} {getUnitLabel()}
                    </span>
                    {isCritical && (
                        <span title="Stok kritis di bawah batas minimum" className="flex items-center text-terracotta-600">
                            <AlertCircle className="w-3.5 h-3.5" />
                        </span>
                    )}
                </div>
                <span className="text-[10px] text-doff-muted block">Min: {item.minimum_alert_stock}</span>
            </td>

            {/* Tombol Aksi Cepat */}
            <td className="px-5 py-4 text-right">
                <div className="inline-flex items-center space-x-2">
                    {/* Single-Tap Waste Action */}
                    <button
                        onClick={() => onRecordWaste(item)}
                        title="Catat bunga layu / rusak (Single-Tap Waste)"
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-terracotta-50 text-terracotta-700 hover:bg-terracotta-100 border border-terracotta-200 transition-colors"
                    >
                        <Flame className="w-3 h-3 stroke-[2]" />
                        <span>Catat Layu</span>
                    </button>

                    {/* Quick Restock Action */}
                    <button
                        onClick={() => onQuickRestock(item)}
                        title="Edit stok fisik atau harga beli"
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-white text-doff-charcoal hover:bg-doff-sand border border-doff-border shadow-2xs transition-colors"
                    >
                        <Edit2 className="w-3 h-3 text-doff-muted" />
                        <span>Restok</span>
                    </button>
                </div>
            </td>
        </tr>
    );
}
