# Coding Conventions & Project Rules

## 1. Format Penamaan File React JS
- Format path & nama file React JS harus mengikuti pola:
  `folder-modul/namamodul-function`
  - Contoh:
    - `bouquet-catalog/bouquet-catalog-list.tsx`
    - `flower-inventory/flower-inventory-table.tsx`
    - `checkout-flow/checkout-payment-summary.tsx`
    - `ai-recommender/ai-recommender-form.tsx`

## 2. Prinsip Clean Code
- Terapkan prinsip Single Responsibility Principle (SRP) dan DRY (Don't Repeat Yourself).
- Berikan penamaan variabel dan fungsi yang jelas, deskriptif, dan bermakna (hindari singkatan ambigu).
- Pisahkan logika bisnis / pemrosesan data (custom hooks / service functions) dari komponen presentasi / UI rendering.
- Pastikan TypeScript types / interfaces terdefinisi dengan jelas dan ketat (hindari `any`).

## 3. Batasan Panjang Fungsi & Komponen
- Setiap fungsi atau komponen React yang memiliki panjang antara **100 – 200 baris (atau lebih)** **WAJIB dipecah** menjadi sub-fungsi (*sub-functions*) atau sub-komponen (*smaller reusable sub-components* / *extracted child components*).
- Pisahkan sub-komponen ke file terpisah jika digunakan ulang, atau tempatkan di helper/sub-component di dalam modul yang sama untuk menjaga keterbacaan (*readability*).

## 4. UI/UX & Design Rules
1. **Icon Style**: Gunakan icon dengan gaya **duo-tone** dan **minimalis** (clean lines, tidak ramai).
2. **Icon Usage**: **Kurangi penggunaan icon** secara berlebihan — gunakan icon hanya jika benar-benar memberikan nilai fungsional / navigasi penting, jangan gunakan sebagai pemanis di setiap tombol/teks.
3. **Mobile-First / Mobile Friendly**: Prioritaskan pengalaman pengguna pada layar smartphone (touch target tombol besar, padding nyaman, responsive layout, bottom tab navigation untuk admin).
4. **Color Palette**: Gunakan palet warna **doff aesthetic** (warna matte/muted, pastel hangat, sage/olive lembut, terracotta/blush doff, charcoal lembut — hindari warna glossy/neon menyala).

## 5. Dashboard Layout & Modular Component Rules
1. **Modularitas Komponen Dashboard**:
   - Komponen shell dashboard seperti **Sidebar**, **Header/Navbar**, **Alert / Notification Banner**, dan komponen penunjang lainnya **WAJIB dibuat modular** ke file terpisah (misal: di direktori `Layouts/components/` atau `Components/dashboard/`).
   - Jangan menumpuk kode sidebar, header, dan konten di dalam satu file layout monolith yang panjang.
2. **Sidebar Buka-Tutup (Collapsible / Toggle)**:
   - Sidebar wajib memiliki fitur buka-tutup (collapse/expand) yang intuitif:
     - Di **Desktop/Tablet**: Bisa di-minimize/collapse (hanya icon atau disembunyikan) dengan tombol toggle agar area kerja tabel/analitik lebih lega.
     - Di **Mobile**: Muncul sebagai off-canvas drawer / overlay sheet saat toggle ditekan.
3. **Active Route Highlight**:
   - Menu di sidebar **wajib memiliki highlight visual yang jelas** untuk route/halaman yang sedang aktif (menggunakan latar belakang aksen doff, teks kontras, dan border indikator aktif) sehingga pengguna selalu mengetahui posisi navigasi mereka secara instan.


