import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import FloristAdminLayout from "@/Layouts/FloristAdminLayout";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { InventoryCategory, ItemCategory, UnitMeasurement } from "./types";
import InventoryCreateSidebar from "./components/InventoryCreateSidebar";
import QuickAddMasterDataModal from "../master-data/components/QuickAddMasterDataModal";

interface FlowerInventoryCreateProps {
    categories?: ItemCategory[];
    units?: UnitMeasurement[];
}

export default function FlowerInventoryCreate({
    categories: initialCategories = [],
    units: initialUnits = [],
}: FlowerInventoryCreateProps) {
    const [categoriesList, setCategoriesList] = React.useState<ItemCategory[]>(initialCategories);
    const [unitsList, setUnitsList] = React.useState<UnitMeasurement[]>(initialUnits);
    const [quickModal, setQuickModal] = React.useState<'category' | 'unit' | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        sku: "",
        barcode: "",
        category: initialCategories[0]?.slug || "fresh_flower",
        category_id: initialCategories[0]?.id || "",
        color: "",
        unit_cost: "",
        stock_quantity: "",
        unit_measurement: initialUnits[0]?.symbol || "stem",
        unit_measurement_id: initialUnits[0]?.id || "",
        shelf_life_days: "5",
        minimum_alert_stock: "10",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/inventory");
    };

    return (
        <FloristAdminLayout
            title="Tambah Bahan Inventori"
            subtitle="Daftarkan bunga segar, kertas wrapping, pita, aksesoris, atau kartu ucapan baru ke workshop."
        >
            <Head title="Tambah Bahan Inventori" />

            <div className="w-full">
                {/* Navigasi Kembali dengan Button Highlight */}
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href="/admin/inventory"
                        className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-doff-charcoal bg-white hover:bg-doff-sand/80 border border-doff-border shadow-xs hover:border-doff-muted/40 transition-all group"
                    >
                        <ArrowLeft className="w-4 h-4 text-doff-muted transition-transform group-hover:-translate-x-0.5 group-hover:text-doff-charcoal" />
                        <span>Kembali ke Daftar Inventori</span>
                    </Link>
                </div>

                {/* Grid 2 Kolom Responsif Memenuhi Seluruh Layar (No Dead Empty Space) */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* Kolom Form Utama (2 Kolom Lebar di Desktop) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Kartu Informasi Utama Bahan */}
                            <div className="bg-white rounded-2xl border border-doff-border p-5 sm:p-6 shadow-2xs space-y-4">
                                <h3 className="font-semibold text-sm text-doff-charcoal border-b border-doff-border pb-3">
                                    Informasi Dasar Bahan
                                </h3>

                                {/* Nama Bahan */}
                                <div>
                                    <label className="block text-xs font-medium text-doff-charcoal mb-1.5">
                                        Nama Bahan / Bunga{" "}
                                        <span className="text-terracotta-600">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Mawar Ecuador Putih, Kertas Celophane Matte Sage"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full text-xs rounded-xl border border-doff-border px-3.5 py-2.5 focus:border-sage-500 focus:ring-0"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-[11px] text-terracotta-600 mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Kategori & Satuan */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-medium text-doff-charcoal">
                                                Kategori{" "}
                                                <span className="text-terracotta-600">
                                                    *
                                                </span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setQuickModal('category')}
                                                className="inline-flex items-center space-x-1 text-[11px] font-medium text-sage-700 hover:text-sage-800 bg-sage-50 hover:bg-sage-100/80 px-2 py-0.5 rounded-md border border-sage-200 transition-colors"
                                                title="Tambah Kategori Baru"
                                            >
                                                <Plus className="w-3 h-3 stroke-[2.5]" />
                                                <span>Tambah</span>
                                            </button>
                                        </div>
                                        <select
                                            value={data.category_id || data.category}
                                            onChange={(e) => {
                                                const selectedId = Number(e.target.value);
                                                const matched = categoriesList.find((c) => c.id === selectedId);
                                                if (matched) {
                                                    setData((prev) => ({
                                                        ...prev,
                                                        category_id: matched.id,
                                                        category: matched.slug as InventoryCategory,
                                                    }));
                                                } else {
                                                    setData((prev) => ({
                                                        ...prev,
                                                        category: e.target.value as InventoryCategory,
                                                    }));
                                                }
                                            }}
                                            className="w-full text-xs rounded-xl border border-doff-border px-3.5 py-2.5 bg-white focus:border-sage-500 focus:ring-0"
                                        >
                                            {categoriesList.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category && (
                                            <p className="text-[11px] text-terracotta-600 mt-1">
                                                {errors.category}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-medium text-doff-charcoal">
                                                Satuan Pengukuran{" "}
                                                <span className="text-terracotta-600">
                                                    *
                                                </span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setQuickModal('unit')}
                                                className="inline-flex items-center space-x-1 text-[11px] font-medium text-sage-700 hover:text-sage-800 bg-sage-50 hover:bg-sage-100/80 px-2 py-0.5 rounded-md border border-sage-200 transition-colors"
                                                title="Tambah Satuan Baru"
                                            >
                                                <Plus className="w-3 h-3 stroke-[2.5]" />
                                                <span>Tambah</span>
                                            </button>
                                        </div>
                                        <select
                                            value={data.unit_measurement_id || data.unit_measurement}
                                            onChange={(e) => {
                                                const selectedId = Number(e.target.value);
                                                const matched = unitsList.find((u) => u.id === selectedId);
                                                if (matched) {
                                                    setData((prev) => ({
                                                        ...prev,
                                                        unit_measurement_id: matched.id,
                                                        unit_measurement: matched.symbol,
                                                    }));
                                                } else {
                                                    setData((prev) => ({
                                                        ...prev,
                                                        unit_measurement: e.target.value,
                                                    }));
                                                }
                                            }}
                                            className="w-full text-xs rounded-xl border border-doff-border px-3.5 py-2.5 bg-white focus:border-sage-500 focus:ring-0"
                                        >
                                            {unitsList.map((unit) => (
                                                <option key={unit.id} value={unit.id}>
                                                    {unit.name} ({unit.symbol})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.unit_measurement && (
                                            <p className="text-[11px] text-terracotta-600 mt-1">
                                                {errors.unit_measurement}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Warna, SKU & Barcode */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-doff-charcoal mb-1.5">
                                            Warna / Varian
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: Red, Peach, Sage"
                                            value={data.color}
                                            onChange={(e) =>
                                                setData("color", e.target.value)
                                            }
                                            className="w-full text-xs rounded-xl border border-doff-border px-3.5 py-2.5 focus:border-sage-500 focus:ring-0"
                                        />
                                        {errors.color && (
                                            <p className="text-[11px] text-terracotta-600 mt-1">
                                                {errors.color}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-doff-charcoal mb-1.5">
                                            Kode SKU
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="FLW-ROSE-WHT"
                                            value={data.sku}
                                            onChange={(e) =>
                                                setData("sku", e.target.value)
                                            }
                                            className="w-full text-xs rounded-xl border border-doff-border px-3.5 py-2.5 font-mono focus:border-sage-500 focus:ring-0"
                                        />
                                        {errors.sku && (
                                            <p className="text-[11px] text-terracotta-600 mt-1">
                                                {errors.sku}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-doff-charcoal mb-1.5">
                                            Barcode Kemasan
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="899123456"
                                            value={data.barcode}
                                            onChange={(e) =>
                                                setData(
                                                    "barcode",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full text-xs rounded-xl border border-doff-border px-3.5 py-2.5 font-mono focus:border-sage-500 focus:ring-0"
                                        />
                                        {errors.barcode && (
                                            <p className="text-[11px] text-terracotta-600 mt-1">
                                                {errors.barcode}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Kartu Harga Modal, Stok & Alert */}
                            <div className="bg-white rounded-2xl border border-doff-border p-5 sm:p-6 shadow-2xs space-y-4">
                                <h3 className="font-semibold text-sm text-doff-charcoal border-b border-doff-border pb-3">
                                    Harga Beli & Manajemen Stok
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-doff-charcoal mb-1.5">
                                            Harga Modal Satuan (Rp){" "}
                                            <span className="text-terracotta-600">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="8000"
                                            value={data.unit_cost}
                                            onChange={(e) =>
                                                setData(
                                                    "unit_cost",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full text-xs rounded-xl border border-doff-border px-3.5 py-2.5 focus:border-sage-500 focus:ring-0"
                                            required
                                        />
                                        {errors.unit_cost && (
                                            <p className="text-[11px] text-terracotta-600 mt-1">
                                                {errors.unit_cost}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-doff-charcoal mb-1.5">
                                            Stok Awal Fisik{" "}
                                            <span className="text-terracotta-600">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="50"
                                            value={data.stock_quantity}
                                            onChange={(e) =>
                                                setData(
                                                    "stock_quantity",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full text-xs rounded-xl border border-doff-border px-3.5 py-2.5 focus:border-sage-500 focus:ring-0"
                                            required
                                        />
                                        {errors.stock_quantity && (
                                            <p className="text-[11px] text-terracotta-600 mt-1">
                                                {errors.stock_quantity}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-doff-charcoal mb-1.5">
                                            Batas Minimum Alert{" "}
                                            <span className="text-terracotta-600">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="10"
                                            value={data.minimum_alert_stock}
                                            onChange={(e) =>
                                                setData(
                                                    "minimum_alert_stock",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full text-xs rounded-xl border border-doff-border px-3.5 py-2.5 focus:border-sage-500 focus:ring-0"
                                            required
                                        />
                                        {errors.minimum_alert_stock && (
                                            <p className="text-[11px] text-terracotta-600 mt-1">
                                                {errors.minimum_alert_stock}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Shelf Life Khusus Bunga Segar */}
                                {data.category === "fresh_flower" && (
                                    <div className="pt-2">
                                        <label className="block text-xs font-medium text-doff-charcoal mb-1.5">
                                            Masa Kesegaran (Hari di Workshop /
                                            Chiller)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="5"
                                            value={data.shelf_life_days}
                                            onChange={(e) =>
                                                setData(
                                                    "shelf_life_days",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full sm:w-1/2 text-xs rounded-xl border border-doff-border px-3.5 py-2.5 focus:border-sage-500 focus:ring-0"
                                        />
                                        <p className="text-[11px] text-doff-muted mt-1">
                                            Estimasi bunga bertahan sebelum
                                            layu. Membantu sistem memonitor
                                            batas kesegaran stok.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Tombol Aksi Bawah */}
                            <div className="flex items-center justify-end space-x-3 pt-2">
                                <Link
                                    href="/admin/inventory"
                                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-doff-charcoal bg-white hover:bg-doff-sand border border-doff-border shadow-xs hover:border-doff-muted/40 transition-all"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-sage-600 text-white hover:bg-sage-700 shadow-xs transition-colors disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>
                                        {processing
                                            ? "Menyimpan..."
                                            : "Simpan Bahan Baku"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Kolom Kanan: Pratinjau Valuasi, Kalkulator Aset & Info Florist (Mengisi Ruang Kosong) */}
                        <div className="lg:col-span-1">
                            <InventoryCreateSidebar data={data} />
                        </div>
                    </div>
                </form>

                {/* Quick Add Modal */}
                <QuickAddMasterDataModal
                    isOpen={quickModal !== null}
                    type={quickModal || 'category'}
                    onClose={() => setQuickModal(null)}
                    onSuccessCategory={(newCat) => {
                        setCategoriesList((prev) => [...prev, newCat]);
                        setData((prev) => ({
                            ...prev,
                            category_id: newCat.id,
                            category: newCat.slug,
                        }));
                    }}
                    onSuccessUnit={(newUnit) => {
                        setUnitsList((prev) => [...prev, newUnit]);
                        setData((prev) => ({
                            ...prev,
                            unit_measurement_id: newUnit.id,
                            unit_measurement: newUnit.symbol,
                        }));
                    }}
                />
            </div>
        </FloristAdminLayout>
    );
}
