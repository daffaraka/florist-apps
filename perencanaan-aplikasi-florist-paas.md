# Perencanaan Aplikasi Florist PaaS

**Versi:** 0.1 (draft awal)
**Terkait:** `spec-modul-aplikasi-florist.md`
**Tanggal:** 4 Agustus 2026

---

## 1. Gambaran Arsitektur

```
┌─────────────────────────────────────────────────────┐
│                   Tenant Layer                       │
│   tokoA.florist-paas.com   tokoB.florist-paas.com    │
└───────────────────┬───────────────────────────────────┘
                     │ resolve tenant dari subdomain/domain
                     ▼
┌─────────────────────────────────────────────────────┐
│           Laravel App (Monolith Modern)             │
│  - Multi-tenancy middleware                          │
│  - Modul: Bunga, Bouket, Occasion, Riwayat, AI,     │
│    Billing, Auth, Tenancy Context                    │
│  - Queue (job async: AI, notifikasi, billing)         │
│  - Inertia.js Adapter (Shared Data, Auth State)     │
└───────────────────┬───────────────────────────────────┘
                     │ Inertia Protocol (JSON over wire)
                     ▼
┌─────────────────────────────────────────────────────┐
│          React + Inertia.js (Frontend Layer)        │
│  - Storefront per tenant (customer-facing)          │
│    (opsional SSR via Inertia SSR jika butuh SEO)    │
│  - Admin panel per tenant (kelola katalog, dsb)     │
│  - Super admin panel (kelola platform & billing)    │
└─────────────────────────────────────────────────────┘
```

**Catatan penting:** 
Dengan **Laravel + Inertia.js + React**, seluruh aplikasi berjalan dalam satu ekosistem (*monolith modern*). Kita tidak lagi membutuhkan REST API terpisah murni untuk konsumsi internal, melainkan memanfaatkan Inertia responses:
- **Routing & Controller** dikendalikan langsung oleh Laravel (`web.php`).
- **Storefront Customer**: Halaman publik tenant dengan React components (bisa mengaktifkan Inertia SSR via Node.js server jika butuh pengindeksan SEO).
- **Admin Panel Tenant**: Halaman dashboard internal untuk florist mengelola katalog, pesanan, dan setting toko.
- **Super Admin Panel**: Halaman platform owner untuk mengelola tenants, langganan, dan metrik sistem.
- **Struktur Halaman Frontend**: Dikelompokkan rapi di bawah `resources/js/Pages/` (misal: `Pages/Storefront/`, `Pages/TenantAdmin/`, `Pages/SuperAdmin/`).

---

## 2. Stack & Package yang Dibutuhkan

### 2.1 Backend & Glue Layer (Laravel + Inertia)

| Kebutuhan | Package | Catatan |
|---|---|---|
| Frontend Adapter | `inertiajs/inertia-laravel` | Penghubung Laravel controller dengan React SPA |
| Multi-tenancy | `stancl/tenancy` atau `spatie/laravel-multitenancy` | Handle subdomain routing dan pemisahan context tenant |
| Autentikasi | `laravel/breeze` (React stack) atau `laravel/jetstream` | Autentikasi sesi bawaan berbasis cookie/session web (lebih simpel daripada token Sanctum untuk monolithic) |
| Role & permission | `spatie/laravel-permission` | Role: Super Admin, Tenant Admin, Staff Toko, Customer |
| Media/foto bunga & bouket | `spatie/laravel-medialibrary` | Handle upload, resize, konversi gambar otomatis |
| Activity log (audit) | `spatie/laravel-activitylog` | Tracking aksi admin di level tenant & super admin |
| Billing/subscription | `laravel/cashier` / Custom Midtrans / Xendit | Untuk platform billing langganan tenant |
| Queue & job async | `laravel/horizon` (Redis) | Untuk proses async AI rekomendasi, email/notifikasi, invoice |
| Rate limiting per tenant | built-in Laravel throttle + middleware | Pembatasan pemanggilan AI dan resource per plan |

### 2.2 Modul AI Rekomendasi

| Kebutuhan | Opsi | Catatan |
|---|---|---|
| LLM API client | HTTP client Laravel bawaan (Guzzle/Http facade) ke Anthropic/OpenAI | Cukup wrapper service class di Laravel |
| Caching hasil rekomendasi | Laravel Cache (Redis) | Cache rekomendasi mood+occasion untuk hemat kuota LLM |
| Rule engine | Custom scoring service di Laravel | Filter awal produk berdasarkan kriteria sebelum/sesudah LLM |

### 2.3 Frontend (React + Inertia.js)

| Kebutuhan | Package | Catatan |
|---|---|---|
| Core Framework | `@inertiajs/react` + `react` + `react-dom` | Integrasi SPA React dengan Laravel controller |
| Build Tool | `vite` + `@vitejs/plugin-react` | Bundling cepat bawaan ekosistem Laravel |
| Styling | `tailwindcss` | Desain responsif konsisten untuk Storefront & Dashboard |
| UI Component | `shadcn/ui` atau `radix-ui` + `lucide-react` | Komponen siap pakai (Modal, Dropdown, Form, Sheet, dll) |
| Form Handling | Inertia `useForm` hook | Validasi error terhubung otomatis dengan Laravel Form Request |
| State Management | Global props Inertia / `zustand` (jika butuh client-only state) | State halaman otomatis mengalir dari controller; Zustand untuk state lokal seperti keranjang belanja sementara |
| File/Image Upload | Dropzone component + Inertia form progress | Upload foto bunga/bouket dengan visual progress bar |
| Charting (Dashboard) | `recharts` | Grafik penjualan & analitik tenant |
| SSR (SEO Storefront) | `@inertiajs/server` (Inertia SSR) | Opsi SSR server Node.js untuk render HTML storefront demi SEO |

---

## 3. Flow Pekerjaan (Development Roadmap)

### Fase 0 — Fondasi Multi-Tenant (sebelum fitur apapun)
- [ ] Setup Laravel + pilih & install package tenancy
- [ ] Desain skema `tenants` table + strategi resolve tenant (subdomain)
- [ ] Middleware tenant resolution + global scope otomatis di semua model
- [ ] Setup role & permission dasar (super admin, tenant admin, staff, customer)
- [ ] Setup CI/CD dasar + environment staging

> ⚠️ Fase ini paling krusial — kesalahan desain di sini mahal untuk diperbaiki belakangan.

### Fase 1 — Modul Inti Toko (Inventori, Stok, Keuangan, Infografis & Katalog)
- [ ] **Modul Multi-Kategori Inventori & Stok**:
  - Tangkai Bunga Segar (masa kesegaran / shelf life)
  - Kertas Wrapping & Pita (satuan roll/lembar)
  - Aksesoris/Boneka/Balon/Kartu ucapan (satuan pcs)
  - Dukungan Kode SKU & Barcode Scanner (kamera HP/scanner)
- [ ] **Pencatatan Bunga Rusak/Layu (*Waste/Spoilage Tracker*)**:
  - Tombol aksi cepat *Single-Tap Waste*: catat bunga layu/patah & potong nilai aset otomatis
- [ ] **Modul Resep Komposisi Bouket (Bill of Materials)**:
  - Visual Palette Picker (`[+]` / `[-]` bunga, kertas, pita)
  - Kalkulasi HPP bahan baku (COGS) otomatis berdasarkan harga modal bahan penyusun
- [ ] **Modul Keuangan (Laba Rugi Otomatis)**:
  - Margin kotor dan laba bersih per produk bouket (`Harga Jual - Total HPP Bahan`)
  - Rekapitulasi omzet dan total profit periode harian/mingguan/bulanan
- [ ] **Modul Infografis & Analitik (Dashboard Recharts)**:
  - 4 Kartu KPI: Total Omzet, Estimasi Laba Bersih, Pesanan Hari Ini, Bunga Kritis/Hampir Habis
  - Bar Chart: Top 5 Bouket Terlaris
  - Line Area Chart: Tren Penjualan Harian/Mingguan
  - Donut Chart: Distribusi Momen / Occasion (Wisuda, Birthday, Wedding, dll)
- [ ] **Modul Occasion & Kalender Timeline Pesanan**:
  - Visual timeline slot pengiriman (*Pagi / Siang / Sore*)
- [ ] **Storefront & WhatsApp-First Checkout**:
  - Browse katalog, detail bouket & kartu ucapan
  - Form checkout langsung generate teks order rapi ke WhatsApp toko

### Fase 2 — Onboarding Tenant & Billing
- [ ] Flow self-service pendaftaran tenant baru
- [ ] Setup awal wizard (nama toko, subdomain, logo, kategori awal)
- [ ] Integrasi payment gateway platform (Midtrans/Xendit) untuk subscription
- [ ] Plan/tier (Basic, Pro) + limit fitur per plan
- [ ] Super admin panel: kelola tenant, monitoring, suspend/aktifkan tenant

### Fase 3 — AI Rekomendasi
- [ ] Rule-based scoring dasar (mood + occasion → kandidat bouket)
- [ ] Integrasi LLM untuk generate alasan rekomendasi (bukan untuk memilih produk)
- [ ] Caching layer untuk hasil rekomendasi
- [ ] Rate limiting AI per tenant/plan
- [ ] A/B test sederhana: rekomendasi AI vs tanpa AI, lihat dampak ke konversi

### Fase 4 — Payment Customer & Notifikasi
- [ ] Payment gateway untuk transaksi customer (beda flow dari billing tenant)
- [ ] Notifikasi (email/WA) untuk konfirmasi pesanan
- [ ] Queue job untuk proses async (kirim notifikasi, generate invoice)

### Fase 5 — Observability & Skalabilitas
- [ ] Monitoring per tenant (aktivitas, error rate, usage AI)
- [ ] Audit log (`spatie/laravel-activitylog`) untuk semua aksi admin
- [ ] Load testing untuk skenario banyak tenant aktif bersamaan
- [ ] Evaluasi apakah perlu upgrade dari shared-schema ke isolasi lebih tinggi (kalau ada tenant besar yang butuh)

---

## 4. Analisis SWOT Teknis & Risiko Internal Aplikasi

Analisis ini murni berfokus pada arsitektur perangkat lunak, reliabilitas kode, performa, dan integritas data internal aplikasi:

### 4.1 Strengths (Kekuatan Teknis & Arsitektur)
- **Monolitik Modern Efisien (Laravel + Inertia + React)**: Menghindari beban pemeliharaan REST API terpisah, routing terpusat di Laravel, validasi form otomatis tersinkron via Inertia `useForm`.
- **Domain Modeling Vertikal (Bill of Materials)**: Mendukung kalkulasi stok nyata di mana bouket memotong stok tangkai bunga mentah (`flowers`) saat dibeli.
- **AI Personalization Sommelier**: Cerdas dalam memberikan rekomendasi emosional berdasarkan occasion, budget, dan filosofi bunga.
- **Pemisahan UI Layer Terstruktur**: Storefront, Tenant Admin, dan Super Admin diatur dalam namespace direktori yang bersih (`Pages/Storefront`, `Pages/TenantAdmin`, `Pages/SuperAdmin`).

### 4.2 Weaknesses (Kelemahan & Limitasi Teknis Internal)
- **Kompleksitas Query Agregasi Stok (Bill of Materials Overhead)**: Menentukan ketersediaan bouket memerlukan agregasi stok semua tangkai penyusunnya. Rentan problem N+1 query jika katalog banyak.
- **Tantangan SEO pada Inertia SPA (Client-side Rendering)**: Secara bawaan Inertia adalah SPA, butuh runtime Node.js tambahan (`@inertiajs/server`) untuk SSR jika storefront butuh pengindeksan penuh Googlebot.
- **State Management Gabungan (Inertia Props vs Local Client State)**: Siklus roundtrip AJAX Inertia kurang cocok untuk live customizer bunga yang real-time; butuh pemisahan state lokal React (Zustand/useState) vs server state.
- **Ukuran Bundle JS (3 Layer dalam 1 Repo)**: Jika tidak menerapkan code-splitting yang ketat, bundle Storefront customer bisa terbebani komponen admin dan charting library.

### 4.3 Opportunities (Peluang Inovasi Teknis Aplikasi)
- **WhatsApp Quick-Checkout Generator**: Fitur backend yang menghasilkan link checkout otomatis berisi ringkasan pesanan & format pesan WhatsApp untuk mempercepat flow kasir toko.
- **Real-time Order Notification**: Menggunakan Laravel Reverb (WebSocket bawaan Laravel) untuk live notifikasi pesanan masuk di dashboard florist tanpa polling manual.
- **Modular Add-on Architecture**: Kemampuan mengaktifkan/menonaktifkan modul tertentu per tenant via fitur flags (misal: modul AI, modul kurir instan).

### 4.4 Threats (Ancaman Teknis & Keandalan Sistem Internal)
- **Risiko Kebocoran Data Antar-Tenant (Tenant Data Leakage)**: Pada shared-database, kelalaian developer lupa menambahkan filter `tenant_id` pada query custom/raw SQL dapat membocorkan data pesanan toko lain.
- **Race Condition Pengurangan Stok Bunga (Concurrency)**: Dua customer checkout secara bersamaan untuk bouket berbeda yang menggunakan sisa stok tangkai bunga mawar yang sama, menyebabkan minus stock (*overselling*).
- **Latency & Kegagalan API LLM (Third-Party Dependency)**: Waktu respons API AI yang lambat (2-8 detik) atau error 500/rate limit dapat menyebabkan controller HTTP hang dan server worker penuh jika dijalankan sinkron.
- **Bottleneck Query Subdomain Resolution**: Setiap HTTP request memeriksa tabel tenants (`SELECT * FROM tenants WHERE subdomain = ?`), berpotensi membebani database jika traffic melonjak.

---

### 4.5 Aturan & Mitigasi Teknis Wajib (Architectural Guardrails)

Untuk mengatasi kelemahan dan ancaman di atas, berikut aturan teknis yang wajib diterapkan dalam kode:

| Isu / Risiko | Aturan Implementasi Wajib |
|---|---|
| **Isolasi Data Tenant** | Wajib menggunakan Trait `BelongsToTenant` dengan **Eloquent Global Scope** otomatis pada semua model tenant (`Flower`, `Bouquet`, `Order`, dll). Dilarang raw query tanpa parameter `tenant_id`. |
| **Race Condition Stok** | Pengurangan stok tangkai bunga di `CheckoutService` wajib dibungkus dalam `DB::transaction()` dan menggunakan **Pessimistic Locking** (`lockForUpdate()`). |
| **API AI Timeout** | Proses AI harus memiliki timeout pendek (maks 5 detik), di-cache agresif berbasis hash parameter (`occasion + mood + budget`), dan memiliki **fallback instan ke rule-based database lokal** jika LLM gagal/timeout. |
| **Subdomain Query Overhead** | Middleware tenant resolution wajib menyimpan object tenant di **Cache (Redis/File)** dengan TTL (misal 1 jam) agar tidak query database di setiap request halaman/aset. |
| **Bundle Size Optimization** | Konfigurasi `app.tsx` wajib menggunakan **dynamic import / code splitting** (`import.meta.glob('./Pages/**/*.tsx')`) agar aset Admin dan Charting tidak pernah dimuat di Storefront customer. |
| **Optimasi Stok Bouket** | Implementasikan database indexing pada foreign key pivot dan kolom virtual / eager loading agregat (`with(['flowers' => fn($q) => $q->select('id', 'stock')])`) untuk mencegah N+1 query. |

---

## 5. Keputusan Desain UI/UX & Profil Persona Florist Owner

Berdasarkan wawancara terarah (*interview/grill-me*) mengenai target pengguna utama (**Wanita pemilik florist yang aktif di workshop**), sistem didesain dengan prinsip-prinsip UI/UX berikut:

1. **Mobile-First PWA / Responsive Admin**:
   - Layout dashboard admin dioptimalkan penuh untuk layar smartphone (tombol aksi besar, ramah sentuhan, navigasi tab bawah ala aplikasi mobile).
   - Memudahkan owner memperbarui stok atau melihat pesanan langsung di workshop saat tangan kotor/basah merangkai bunga tanpa harus membuka laptop.

2. **Visual Palette Picker untuk Resep Bouket (Bill of Materials)**:
   - Tidak menggunakan tabel angka yang kaku.
   - Menggunakan kartu visual bunga bergambar dengan kontrol sentuh `[+]` dan `[-]` untuk menambahkan tangkai bunga ke dalam komposisi bouket (misal: *Mawar Merah [+][10][-], Baby's Breath [+][2][-]*).

3. **Alur Transaksi WhatsApp-First**:
   - Storefront dilengkapi tombol **"Order via WhatsApp"** yang otomatis membuat format teks pesan WhatsApp rapi berisi detail bouket, pilihan slot tanggal/jam kirim, isi kartu ucapan, dan nominal total.
   - Pembayaran diverifikasi langsung oleh owner florist melalui transfer bank/QRIS manual, sesuai kebiasaan transaksi florist lokal.

4. **Guided Step-by-Step Wizard untuk AI Recommender**:
   - Tampilan AI Sommelier menggunakan wizard interaktif 4 langkah yang visual dan emosional: *Pilih Momen → Tentukan Budget → Pilih Emosi/Mood → Dapatkan Rekomendasi + Preview Kartu Ucapan*.

5. **Kalender & Timeline Jadwal Pengiriman Bunga**:
   - Dashboard pesanan mengutamakan tampilan visual kalender dan slot jam pengiriman (*Pagi 09:00-12:00*, *Sore 14:00-17:00*) dengan status jelas (*Perlu Dirangkai*, *Siap Kirim*, *Terkirim*) agar bunga segar tidak pernah terlewat deadline.

6. **Satu Tema Elegan Standar (Zero Setup Burden)**:
   - Storefront menggunakan desain netral, minimalis, dan estetik bawaan platform secara seragam.
   - Owner florist tidak perlu dipusingkan dengan pemilihan kode warna, cukup mengunggah **Foto Banner**, **Logo Toko**, dan **Nomor WhatsApp**.

---

## 6. Open Questions & Konsensus

| # | Aspek Keputusan | Konsensus Terpilih |
|---|---|---|
| 1 | Target Device & Gaya Admin | **Mobile-First PWA** dengan tombol besar & tab bar bawah |
| 2 | Alur Checkout Transaksi | **WhatsApp-First Checkout** (generate template chat rapi) |
| 3 | Formula Komposisi Bunga | **Visual Palette Picker** (kartu bunga + tombol +/-) |
| 4 | Bentuk Interaksi AI | **Guided Step-by-Step Wizard** 4-langkah |
| 5 | Tampilan Jadwal Pesanan | **Kalender & Timeline Slot Jam Kirim** |
| 6 | Tema Storefront Tenant | **Satu Tema Elegan Standar** (custom logo, banner, kontak) |
| 7 | Cakupan Inventori & Stok | **Multi-Kategori (Bunga Segar, Wrapping/Pita, Aksesoris) + SKU & Barcode Scanner** |
| 8 | Pencatatan Bunga Rusak/Layu | **Single-Tap Waste Button** (catat bunga layu & potong nilai aset otomatis) |
| 9 | Modul Keuangan Florist | **Laba Rugi Otomatis** (Margin per bouket = Harga Jual - Total HPP Bahan Baku) |
| 10 | Infografis Dashboard | **4 Kartu KPI + 3 Visual Recharts (Top Bouket, Tren Penjualan, Distribusi Momen)** |

---

## 7. Catatan

Dokumen ini merupakan acuan arsitektur Laravel + React + Inertia.js lengkap dengan konsensus UI/UX dan fitur operasional toko (Inventori, Stok, Keuangan, Infografis). Langkah berikutnya adalah inisialisasi project Laravel, konfigurasi starter kit Breeze (React + Inertia + TypeScript), dan pembuatan skema database (ERD/Migration).
