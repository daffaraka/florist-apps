<?php

namespace Database\Seeders;

use App\Models\Bouquet;
use App\Models\Order;
use App\Models\Review;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = Tenant::first();
        if (!$tenant) {
            return;
        }

        $bouquets = Bouquet::where('tenant_id', $tenant->id)->get();
        $b1 = $bouquets->firstWhere('slug', 'classic-crimson-romance') ?? $bouquets->first();
        $b2 = $bouquets->firstWhere('slug', 'whispering-white-sage') ?? $bouquets->last();
        $order = Order::where('tenant_id', $tenant->id)->first();

        // 1. Admin Curated Testimoni dengan Foto (Anniversary)
        Review::create([
            'tenant_id' => $tenant->id,
            'bouquet_id' => $b1?->id,
            'order_id' => null,
            'customer_name' => 'dr. Amanda Clarissa',
            'customer_handle' => 'Via WhatsApp • Anniversary',
            'rating' => 5,
            'review_text' => 'Bunganya harum sekali dan mawarnya segar tahan sampai 4 hari! Wrapping sage doff-nya benar-benar elegan dan estetik, suami saya suka banget.',
            'photo_url' => 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
            'source' => 'admin_curated',
            'is_featured' => true,
            'is_published' => true,
            'review_date' => now()->subDays(6)->toDateString(),
        ]);

        // 2. Verified Order Testimoni dengan Foto (Wisuda)
        Review::create([
            'tenant_id' => $tenant->id,
            'bouquet_id' => $b1?->id,
            'order_id' => $order?->id,
            'customer_name' => 'Rina Andriana',
            'customer_handle' => 'Wisuda UGM • Verified Buyer',
            'rating' => 5,
            'review_text' => 'Pengantaran tepat waktu ke Graha Saba. Kartu ucapannya dicetak rapi dan pitanya cantik banget. Teman-teman pada nanya beli di mana!',
            'photo_url' => 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
            'source' => 'verified_order',
            'is_featured' => true,
            'is_published' => true,
            'review_date' => now()->subDays(4)->toDateString(),
        ]);

        // 3. Admin Curated Testimoni dengan Foto (Engagement / Wedding)
        Review::create([
            'tenant_id' => $tenant->id,
            'bouquet_id' => $b2?->id,
            'order_id' => null,
            'customer_name' => 'Nadira & Kevin',
            'customer_handle' => 'Wedding Engagement',
            'rating' => 5,
            'review_text' => 'Perpaduan mawar putih dan eucalyptus-nya wangi dan tenang banget suasananya. Foto-foto lamaran kami jadi kelihatan mahal dan berkelas. Terima kasih Bloom Artisan!',
            'photo_url' => 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
            'source' => 'admin_curated',
            'is_featured' => true,
            'is_published' => true,
            'review_date' => now()->subDays(2)->toDateString(),
        ]);

        // 4. Testimoni Toko Umum (Corporate)
        Review::create([
            'tenant_id' => $tenant->id,
            'bouquet_id' => null,
            'order_id' => null,
            'customer_name' => 'Hendra Wijaya',
            'customer_handle' => 'Klien Korporat',
            'rating' => 5,
            'review_text' => 'Pelayanan admin via WhatsApp sangat responsif dan sigap saat kami butuh buket ucapan selamat mendadak untuk rekan kerja. Bunga segar dan pengiriman tepat waktu.',
            'photo_url' => null,
            'source' => 'admin_curated',
            'is_featured' => false,
            'is_published' => true,
            'review_date' => now()->subDay()->toDateString(),
        ]);
    }
}
