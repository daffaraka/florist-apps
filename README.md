# 🌸 Bloom Artisan — Modern Florist PaaS & Studio Management

> **Platform as a Service (PaaS) & Smart Studio Management** khusus pemilik bisnis toko bunga (*florist*). Dibangun dengan monolitik modern **Laravel 12 + React + Inertia.js**, mengusung desain **Doff Aesthetic**, navigasi modular responsif, dan logika bisnis vertikal industri bunga.

---

## ✨ Fitur Utama

### 1. 📊 Dashboard Florist & Infografis (Desktop & Tablet)
- **4 Kartu KPI Keuangan & Operasional**: Total Omzet, Estimasi Laba Bersih, Pesanan Hari Ini, dan Stok Bahan Kritis.
- **Visual Infografis Recharts**:
  - *Area Chart*: Tren Penjualan & Laba 7 Hari Terakhir.
  - *Pie/Donut Chart*: Komposisi Momen / Occasion (Wisuda, Birthday, Anniversary, Condolence).
  - *Bar Chart*: Top 5 Bouket Terfavorit & Terlaris.
- **Shell Modular**: Sidebar yang dapat di-minimize/expand (*collapsible toggle*), header terpisah, dan highlight rute aktif.

### 2. 🌿 Inventori Multi-Kategori & Bill of Materials (BOM)
- **Kategori Bahan Baku**: Bunga Segar (dengan masa kesegaran/shelf life), Kertas Wrapping, Pita Satin, Aksesoris, dan Kartu Ucapan.
- **Dukungan SKU & Barcode**: Memudahkan pencatatan keluar-masuk barang via scanner barcode.
- **Resep Komposisi Bouket**: Setiap bouket memiliki resep bahan penyusun, sehingga penjualan bouket otomatis memotong stok fisik tangkai bunga dan kertas terkait.
- **Perhitungan HPP (COGS) Otomatis**: Menghitung modal dasar bahan baku per bouket secara real-time.

### 3. 🥀 Single-Tap Flower Waste Tracker
- Tombol aksi cepat untuk mencatat bunga yang layu, patah, atau rusak di workshop.
- Otomatis memotong stok fisik dan menghitung nilai kerugian aset (*spoilage cost*).

### 4. 💰 Laba Rugi Otomatis (Florist Finance)
- Rekapitulasi finansial otomatis: `Laba Bersih = Total Omzet - Total HPP Bahan - Kerugian Bunga Layu`.
- Dilengkapi kalkulasi margin keuntungan per produk dan riwayat transaksi.

### 5. 🕒 Kalender Jadwal Pengiriman & WhatsApp-First Checkout
- Pengelompokan pesanan berdasarkan slot waktu pengiriman bunga (*Pagi 09:00-12:00*, *Siang 13:00-16:00*, *Sore 17:00-20:00*).
- Status pengerjaan real-time (*Confirmed*, *Sedang Dirangkai*, *Siap Kirim*, *Terkirim*).
- Storefront siap terintegrasi dengan tombol pesan cepat via WhatsApp.

---

## 🛠️ Tech Stack & Architecture

- **Backend**: [Laravel 12](https://laravel.com) (PHP 8.4)
- **Frontend SPA**: [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- **Glue Layer**: [Inertia.js v2](https://inertiajs.com) (Server-driven SPA)
- **Styling & UI**: [Tailwind CSS v3](https://tailwindcss.com) (Custom Doff Aesthetic Palette: *Canvas, Sand, Sage, Blush, Terracotta*)
- **Icons & Charts**: [Lucide React](https://lucide.dev) (Minimalist duo-tone lines) & [Recharts](https://recharts.org)
- **Database**: SQLite / MySQL dengan arsitektur Row-Level Multi-Tenancy (`tenant_id` + Eloquent Global Scope)

---

## 🎨 Desain & UI/UX Guidelines

Platform ini mematuhi standar desain khusus di file konfigurasi:
1. **Doff Aesthetic**: Warna matte yang teduh, pastel hangat, sage botani, dan charcoal lembut (tanpa warna neon glossy).
2. **Icon Minimalis**: Mengutamakan clean-lines dan hanya digunakan pada elemen navigasi fungsional.
3. **Modular Shell Components**: Sidebar, Header, Banner Notifikasi, dan Widget metrik dipecah menjadi sub-komponen terpisah (< 100-200 baris kode).
4. **Responsive Experience**: Nyaman diakses di desktop monitor kasir, tablet workshop, hingga smartphone owner.

---

## 🚀 Panduan Instalasi Lokal

### Prasyarat
- PHP >= 8.2 (Direkomendasikan PHP 8.3 atau 8.4)
- Composer >= 2.x
- Node.js >= 20.x & NPM

### Langkah-Langkah

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/username/florist-apps.git
   cd florist-apps
   ```

2. **Instal Dependensi Backend (PHP)**:
   ```bash
   composer install
   ```

3. **Instal Dependensi Frontend (Node.js)**:
   ```bash
   npm install
   ```

4. **Konfigurasi Environment**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Migrasi Database & Seeder Data Awal**:
   ```bash
   php artisan migrate --seed
   ```
   *Seeder otomatis membuat tenant percontohan "Bloom & Blossom Florist", master bunga, resep bouket, dan sampel pesanan.*

6. **Jalankan Aplikasi**:
   * Jalankan Vite compiler:
     ```bash
     npm run dev
     ```
   * Di terminal terpisah, jalankan Laravel server:
     ```bash
     php artisan serve
     ```

7. **Buka di Browser**:
   Kunjungi dashboard di: [http://127.0.0.1:8000/admin/dashboard](http://127.0.0.1:8000/admin/dashboard)

---

## 📁 Struktur Halaman Frontend

Format penamaan mengikuti pola: `folder-modul/namamodul-function.tsx`

```
resources/js/
├── Layouts/
│   ├── FloristAdminLayout.tsx          # Master shell desktop/tablet
│   └── components/
│       ├── florist-admin-sidebar.tsx   # Sidebar collapsible & route highlight
│       ├── florist-admin-header.tsx    # Header sticky & tanggal dinamis
│       └── florist-alert-banner.tsx    # Notifikasi banner modular
├── Pages/
│   └── florist-admin/
│       ├── florist-admin-dashboard.tsx # Halaman orkestrasi dashboard
│       └── components/
│           ├── florist-kpi-cards.tsx
│           ├── florist-infographics-charts.tsx
│           └── florist-low-stock-alert-table.tsx
```

---

## 📄 Lisensi

Proyek ini berada di bawah lisensi [MIT License](LICENSE).
