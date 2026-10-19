<?php

namespace Tests\Feature;

use App\Models\Bouquet;
use App\Models\Order;
use App\Models\Review;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StorefrontAndReviewTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        if (Tenant::count() === 0) {
            $this->seed();
        }
    }

    public function test_storefront_page_can_be_accessed_publicly(): void
    {
        $response = $this->get('/store');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('storefront-flow/StorefrontCatalogView')
            ->has('tenant')
            ->has('bouquets')
            ->has('reviews')
        );
    }

    public function test_admin_review_management_page_can_be_accessed(): void
    {
        $user = User::first();

        $response = $this->actingAs($user)->get('/admin/reviews');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('review-management/ReviewManagementList')
            ->has('reviews')
            ->has('stats')
            ->has('availableBouquets')
        );
    }

    public function test_admin_can_store_manual_review(): void
    {
        $user = User::first();
        $bouquet = Bouquet::first();

        $response = $this->actingAs($user)->post('/admin/reviews', [
            'customer_name' => 'Bunga Citra',
            'customer_handle' => 'Via WhatsApp',
            'bouquet_id' => $bouquet->id,
            'rating' => 5,
            'review_text' => 'Bunganya sangat segar dan pengirimannya cepat sekali!',
            'review_date' => now()->toDateString(),
            'is_featured' => true,
            'is_published' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('reviews', [
            'customer_name' => 'Bunga Citra',
            'rating' => 5,
            'source' => 'admin_curated',
            'is_featured' => true,
        ]);
    }

    public function test_customer_can_submit_review_with_order_number(): void
    {
        $order = Order::first();

        $response = $this->post('/store/reviews', [
            'order_number' => $order->order_number,
            'customer_name' => 'Rina Andriana',
            'rating' => 5,
            'review_text' => 'Buket sampai dengan kondisi sempurna dan wangi!',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('reviews', [
            'customer_name' => 'Rina Andriana',
            'order_id' => $order->id,
            'source' => 'verified_order',
        ]);
    }
}
