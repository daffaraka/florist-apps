<?php

namespace Database\Seeders;

use App\Models\Bouquet;
use App\Models\BouquetComposition;
use App\Models\InventoryItem;
use App\Models\Occasion;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Tenant Percontohan (Bloom & Blossom Florist)
        $tenant = Tenant::create([
            'name' => 'Bloom & Blossom Florist',
            'subdomain' => 'bloom',
            'whatsapp_number' => '6281234567890',
            'about_text' => 'Studio Florist Artisan dengan spesialisasi bunga segar impor dan buket estetik bernuansa pastel lembut.',
            'plan_tier' => 'pro',
            'is_active' => true,
        ]);

        // Akun Florist Owner
        User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Sarah Florist Owner',
            'email' => 'sarah@bloom.test',
            'password' => Hash::make('password'),
            'role' => 'florist_owner',
        ]);

        // Bind current tenant context during seeding
        app()->instance('current_tenant_id', $tenant->id);

        // 2. Occasions Global
        $occasions = [
            ['name' => 'Wisuda & Kelulusan', 'slug' => 'wisuda', 'emoji' => '🎓'],
            ['name' => 'Ulang Tahun', 'slug' => 'birthday', 'emoji' => '🎂'],
            ['name' => 'Romantis & Anniversary', 'slug' => 'romantis', 'emoji' => '💖'],
            ['name' => 'Duka Cita & Simpati', 'slug' => 'condolence', 'emoji' => '🕊️'],
            ['name' => 'Hari Ibu & Kasih Sayang', 'slug' => 'hari-ibu', 'emoji' => '🌸'],
        ];

        $occasionModels = [];
        foreach ($occasions as $occ) {
            $occasionModels[$occ['slug']] = Occasion::create($occ);
        }

        // 3. Inventori Bahan Baku Multi-Kategori (Stok Awal)
        // Bunga Segar
        $mawarMerah = InventoryItem::create([
            'name' => 'Mawar Holland Merah',
            'sku' => 'FLW-ROSE-RED',
            'barcode' => '8991001001',
            'category' => 'fresh_flower',
            'color' => 'Crimson Red',
            'unit_cost' => 8000,
            'stock_quantity' => 120,
            'unit_measurement' => 'stem',
            'shelf_life_days' => 5,
            'minimum_alert_stock' => 15,
        ]);

        $mawarPutih = InventoryItem::create([
            'name' => 'Mawar Ecuador Putih',
            'sku' => 'FLW-ROSE-WHT',
            'barcode' => '8991001002',
            'category' => 'fresh_flower',
            'color' => 'Pure White',
            'unit_cost' => 9000,
            'stock_quantity' => 80,
            'unit_measurement' => 'stem',
            'shelf_life_days' => 5,
            'minimum_alert_stock' => 10,
        ]);

        $babyBreath = InventoryItem::create([
            'name' => "Baby's Breath Million Star",
            'sku' => 'FLW-BB-WHT',
            'barcode' => '8991001003',
            'category' => 'fresh_flower',
            'color' => 'White Mist',
            'unit_cost' => 3500,
            'stock_quantity' => 200,
            'unit_measurement' => 'stem',
            'shelf_life_days' => 7,
            'minimum_alert_stock' => 20,
        ]);

        $eucalyptus = InventoryItem::create([
            'name' => 'Daun Eucalyptus Parvifolia',
            'sku' => 'FLW-EUC-GRN',
            'barcode' => '8991001004',
            'category' => 'fresh_flower',
            'color' => 'Sage Green',
            'unit_cost' => 2500,
            'stock_quantity' => 90,
            'unit_measurement' => 'stem',
            'shelf_life_days' => 10,
            'minimum_alert_stock' => 10,
        ]);

        // Kertas Wrapping & Pita
        $kertasKorean = InventoryItem::create([
            'name' => 'Korean Matte Wrapping Paper (Sage & Cream)',
            'sku' => 'MAT-WRP-SAGE',
            'barcode' => '8992001001',
            'category' => 'wrapping_paper',
            'color' => 'Sage Doff',
            'unit_cost' => 4500,
            'stock_quantity' => 60,
            'unit_measurement' => 'sheet',
            'minimum_alert_stock' => 10,
        ]);

        $pitaSatin = InventoryItem::create([
            'name' => 'Pita Satin Doff 2.5cm Terracotta',
            'sku' => 'MAT-RIB-TERRA',
            'barcode' => '8992001002',
            'category' => 'ribbon',
            'color' => 'Terracotta',
            'unit_cost' => 1500,
            'stock_quantity' => 150,
            'unit_measurement' => 'meter',
            'minimum_alert_stock' => 20,
        ]);

        // Kartu Ucapan
        $kartuUcapan = InventoryItem::create([
            'name' => 'Kartu Ucapan Doff Foil Gold',
            'sku' => 'ACC-CRD-GOLD',
            'barcode' => '8993001001',
            'category' => 'greeting_card',
            'color' => 'Ivory Gold',
            'unit_cost' => 2000,
            'stock_quantity' => 100,
            'unit_measurement' => 'pcs',
            'minimum_alert_stock' => 15,
        ]);

        // 4. Katalog Bouket & Bill of Materials (Resep Komposisi)
        // Bouket 1: Classic Crimson Romance
        $b1 = Bouquet::create([
            'title' => 'Classic Crimson Romance',
            'slug' => 'classic-crimson-romance',
            'description' => 'Rangkaian 10 tangkai mawar merah Holland dipadu aksen baby breath lembut dan wrapping sage doff bernuansa hangat.',
            'selling_price' => 285000,
            'is_ready_stock' => true,
            'is_active' => true,
        ]);
        $b1->occasions()->attach([$occasionModels['romantis']->id, $occasionModels['birthday']->id]);

        // Resep B1: 10 Mawar Merah + 3 Baby Breath + 2 Kertas + 1.5 Meter Pita + 1 Kartu
        BouquetComposition::create(['bouquet_id' => $b1->id, 'inventory_item_id' => $mawarMerah->id, 'required_quantity' => 10]);
        BouquetComposition::create(['bouquet_id' => $b1->id, 'inventory_item_id' => $babyBreath->id, 'required_quantity' => 3]);
        BouquetComposition::create(['bouquet_id' => $b1->id, 'inventory_item_id' => $kertasKorean->id, 'required_quantity' => 2]);
        BouquetComposition::create(['bouquet_id' => $b1->id, 'inventory_item_id' => $pitaSatin->id, 'required_quantity' => 1.5]);
        BouquetComposition::create(['bouquet_id' => $b1->id, 'inventory_item_id' => $kartuUcapan->id, 'required_quantity' => 1]);
        $b1->recalculateCogs(); // Hitung HPP otomatis

        // Bouket 2: Whispering Eucalyptus Pure
        $b2 = Bouquet::create([
            'title' => 'Whispering White & Sage',
            'slug' => 'whispering-white-sage',
            'description' => 'Paduan anggun mawar putih Ecuador dengan rimbunnya daun eucalyptus dan sentuhan baby breath puitis.',
            'selling_price' => 245000,
            'is_ready_stock' => true,
            'is_active' => true,
        ]);
        $b2->occasions()->attach([$occasionModels['wisuda']->id, $occasionModels['hari-ibu']->id]);

        // Resep B2: 6 Mawar Putih + 4 Eucalyptus + 2 Baby Breath + 2 Kertas + 1 Meter Pita + 1 Kartu
        BouquetComposition::create(['bouquet_id' => $b2->id, 'inventory_item_id' => $mawarPutih->id, 'required_quantity' => 6]);
        BouquetComposition::create(['bouquet_id' => $b2->id, 'inventory_item_id' => $eucalyptus->id, 'required_quantity' => 4]);
        BouquetComposition::create(['bouquet_id' => $b2->id, 'inventory_item_id' => $babyBreath->id, 'required_quantity' => 2]);
        BouquetComposition::create(['bouquet_id' => $b2->id, 'inventory_item_id' => $kertasKorean->id, 'required_quantity' => 2]);
        BouquetComposition::create(['bouquet_id' => $b2->id, 'inventory_item_id' => $pitaSatin->id, 'required_quantity' => 1]);
        BouquetComposition::create(['bouquet_id' => $b2->id, 'inventory_item_id' => $kartuUcapan->id, 'required_quantity' => 1]);
        $b2->recalculateCogs();

        // 5. Contoh Order Masuk (Untuk Mengisi Data Keuangan & Infografis)
        $order = Order::create([
            'order_number' => 'ORD-' . strtoupper(Str::random(6)),
            'customer_name' => 'Rina Andriana',
            'customer_whatsapp' => '6289876543210',
            'recipient_name' => 'Dimas Pratama',
            'recipient_phone' => '6289876543211',
            'delivery_address' => 'Gedung Graha Saba Universitas, Jl. Kaliurang KM 5',
            'delivery_date' => now()->addDay()->toDateString(),
            'delivery_time_slot' => 'morning_09_12',
            'greeting_card_message' => 'Selamat atas kelulusanmu Dimas! Bangga sekali dengan perjuanganmu.',
            'subtotal_amount' => $b1->selling_price,
            'total_cogs_amount' => $b1->estimated_cogs,
            'total_profit_amount' => ($b1->selling_price - $b1->estimated_cogs),
            'status' => 'confirmed',
            'florist_notes' => 'Tolong wrapping dibuat ekstra rapi dan pita disisakan menjuntai 20cm.',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'bouquet_id' => $b1->id,
            'bouquet_title' => $b1->title,
            'quantity' => 1,
            'unit_selling_price' => $b1->selling_price,
            'unit_cogs_price' => $b1->estimated_cogs,
            'subtotal_price' => $b1->selling_price,
        ]);
    }
}
