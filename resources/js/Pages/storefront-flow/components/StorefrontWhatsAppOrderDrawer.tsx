import React, { useState } from 'react';
import { X, Send, Calendar, Clock, MessageSquare, MapPin } from 'lucide-react';
import { StorefrontBouquet, StorefrontTenant } from '../types';

interface StorefrontWhatsAppOrderDrawerProps {
    isOpen: boolean;
    bouquet: StorefrontBouquet | null;
    tenant: StorefrontTenant;
    onClose: () => void;
}

export default function StorefrontWhatsAppOrderDrawer({
    isOpen,
    bouquet,
    tenant,
    onClose,
}: StorefrontWhatsAppOrderDrawerProps) {
    if (!isOpen || !bouquet) return null;

    const [form, setForm] = useState({
        customer_name: '',
        customer_whatsapp: '',
        delivery_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        delivery_time_slot: 'morning_09_12',
        recipient_name: '',
        recipient_phone: '',
        delivery_address: '',
        card_to: '',
        card_from: '',
        card_message: '',
        notes: '',
    });

    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(bouquet.selling_price);

    const slotLabels: Record<string, string> = {
        morning_09_12: 'Pagi (09:00 - 12:00 WIB)',
        afternoon_13_16: 'Siang (13:00 - 16:00 WIB)',
        evening_17_20: 'Sore (17:00 - 20:00 WIB)',
    };

    const handleSendWhatsApp = (e: React.FormEvent) => {
        e.preventDefault();

        const messageLines = [
            `Halo ${tenant.name} 🌸,`,
            `Saya ingin memesan buket bunga dari etalase website:`,
            ``,
            `💐 *Pesanan:* ${bouquet.title} (1x)`,
            `💰 *Total Harga:* ${formattedPrice}`,
            `📅 *Tanggal Kirim:* ${form.delivery_date}`,
            `⏰ *Slot Jam:* ${slotLabels[form.delivery_time_slot]}`,
            ``,
            `💌 *Kartu Ucapan:*`,
            `• Kepada: ${form.card_to || '-'}`,
            `• Dari: ${form.card_from || '-'}`,
            `• Pesan: "${form.card_message || '-'}"`,
            ``,
            `📍 *Alamat Pengantaran:*`,
            `${form.delivery_address || 'Ambil di Toko / Sesuai kesepakatan'}`,
            `Penerima: ${form.recipient_name || form.customer_name} (${form.recipient_phone || form.customer_whatsapp})`,
        ];

        if (form.notes.trim()) {
            messageLines.push(``, `Catatan Khusus: ${form.notes}`);
        }

        messageLines.push(``, `Mohon informasi ketersediaan slot dan instruksi pembayarannya ya. Terima kasih!`);

        const fullMessage = messageLines.join('\n');
        const encodedUrl = `https://wa.me/${tenant.whatsapp_number}?text=${encodeURIComponent(fullMessage)}`;

        window.open(encodedUrl, '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
                {/* Header Drawer */}
                <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-stone-900 font-serif">Format Pemesanan Buket</h3>
                        <p className="text-xs text-stone-600 mt-0.5">Draf pesan otomatis siap kirim ke WhatsApp toko</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-stone-600 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Ringkasan Buket */}
                <div className="px-5 py-3 bg-stone-50 border-b border-stone-100 flex items-center space-x-3.5">
                    {bouquet.photo_url && (
                        <img
                            src={bouquet.photo_url}
                            alt={bouquet.title}
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-800 truncate">{bouquet.title}</h4>
                        <div className="text-xs font-extrabold text-sage-700">{formattedPrice}</div>
                    </div>
                </div>

                {/* Form Input Scrollable */}
                <form id="wa-order-form" onSubmit={handleSendWhatsApp} className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
                    {/* Data Pemesan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block font-semibold text-stone-700 mb-1">Nama Pemesan *</label>
                            <input
                                type="text"
                                required
                                value={form.customer_name}
                                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                                placeholder="cth. Dimas Pratama"
                                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 text-xs"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-stone-700 mb-1">No. WhatsApp Pemesan *</label>
                            <input
                                type="tel"
                                required
                                value={form.customer_whatsapp}
                                onChange={(e) => setForm({ ...form, customer_whatsapp: e.target.value })}
                                placeholder="cth. 08123456789"
                                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 text-xs"
                            />
                        </div>
                    </div>

                    {/* Jadwal Pengantaran */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block font-semibold text-stone-700 mb-1">Tanggal Pengantaran *</label>
                            <input
                                type="date"
                                required
                                value={form.delivery_date}
                                onChange={(e) => setForm({ ...form, delivery_date: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 text-xs bg-white"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-stone-700 mb-1">Slot Waktu Kirim *</label>
                            <select
                                value={form.delivery_time_slot}
                                onChange={(e) => setForm({ ...form, delivery_time_slot: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 text-xs bg-white cursor-pointer"
                            >
                                <option value="morning_09_12">Pagi (09:00 - 12:00)</option>
                                <option value="afternoon_13_16">Siang (13:00 - 16:00)</option>
                                <option value="evening_17_20">Sore (17:00 - 20:00)</option>
                            </select>
                        </div>
                    </div>

                    {/* Kartu Ucapan */}
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2.5">
                        <div className="font-bold text-stone-800 text-xs flex items-center space-x-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-sage-600" />
                            <span>Pesan Kartu Ucapan (Gratis Dicetak)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                placeholder="Kepada (To)"
                                value={form.card_to}
                                onChange={(e) => setForm({ ...form, card_to: e.target.value })}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs"
                            />
                            <input
                                type="text"
                                placeholder="Dari (From)"
                                value={form.card_from}
                                onChange={(e) => setForm({ ...form, card_from: e.target.value })}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs"
                            />
                        </div>
                        <textarea
                            rows={2}
                            placeholder="Tuliskan ucapan selamat, doa, atau pesan kasih..."
                            value={form.card_message}
                            onChange={(e) => setForm({ ...form, card_message: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs leading-relaxed"
                        />
                    </div>

                    {/* Alamat Pengantaran */}
                    <div>
                        <label className="block font-semibold text-stone-700 mb-1">Alamat Lengkap Pengantaran *</label>
                        <textarea
                            required
                            rows={2}
                            value={form.delivery_address}
                            onChange={(e) => setForm({ ...form, delivery_address: e.target.value })}
                            placeholder="Alamat jalan, nomor rumah/gedung, patokan..."
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 text-xs leading-relaxed"
                        />
                    </div>

                    {/* Catatan Khusus */}
                    <div>
                        <label className="block font-semibold text-stone-700 mb-1">Catatan Tambahan (Opsional)</label>
                        <input
                            type="text"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            placeholder="cth. Tolong pita jangan dipotong pendek"
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                        />
                    </div>
                </form>

                {/* Footer Drawer */}
                <div className="p-4 border-t border-stone-100 bg-stone-50">
                    <button
                        type="submit"
                        form="wa-order-form"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                        <Send className="w-4 h-4" />
                        <span>Kirim Pesanan ke WhatsApp Toko</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
