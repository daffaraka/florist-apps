<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Bouquet;
use App\Models\Occasion;
use App\Models\Order;
use App\Models\Review;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontCatalogController extends Controller
{
    /**
     * Tampilkan Etalase Publik Customer (Semi E-Commerce dengan WhatsApp Checkout & Review)
     */
    public function index(Request $request): Response
    {
        // Temukan tenant aktif (berdasarkan subdomain atau tenant utama default)
        $tenant = Tenant::where('is_active', true)->first();
        if (!$tenant) {
            abort(404, 'Toko florist tidak ditemukan atau sedang dinonaktifkan.');
        }

        // Ambil daftar Momen / Occasion
        $occasions = Occasion::orderBy('name')->get();

        // Query Buket Aktif
        $bouquetQuery = Bouquet::with([
            'occasions',
            'reviews' => function ($q) {
                $q->where('is_published', true);
            },
            'compositions.inventoryItem:id,name,color,unit_measurement',
        ])
        ->where('tenant_id', $tenant->id)
        ->where('is_active', true)
        ->orderByDesc('is_featured')
        ->orderBy('title');

        // Filter Momen
        if ($occasionSlug = $request->input('occasion')) {
            $bouquetQuery->whereHas('occasions', function ($q) use ($occasionSlug) {
                $q->where('slug', $occasionSlug);
            });
        }

        // Filter Hanya Ready Stock
        if ($request->boolean('ready_only')) {
            $bouquetQuery->where('is_ready_stock', true);
        }

        // Filter Rentang Budget
        if ($maxPrice = $request->input('max_price')) {
            $bouquetQuery->where('selling_price', '<=', (float) $maxPrice);
        }

        $bouquets = $bouquetQuery->get()->map(function ($bouquet) {
            $publishedReviews = $bouquet->reviews;
            $avgRating = $publishedReviews->count() > 0 ? round($publishedReviews->avg('rating'), 1) : 5.0;
            return [
                'id' => $bouquet->id,
                'title' => $bouquet->title,
                'slug' => $bouquet->slug,
                'description' => $bouquet->description,
                'selling_price' => (float) $bouquet->selling_price,
                'photo_url' => $bouquet->photo_url,
                'is_ready_stock' => $bouquet->is_ready_stock,
                'is_featured' => $bouquet->is_featured,
                'occasions' => $bouquet->occasions,
                'compositions' => $bouquet->compositions,
                'rating_average' => $avgRating,
                'reviews_count' => $publishedReviews->count(),
                'recent_reviews' => $publishedReviews->take(3)->values(),
            ];
        });

        // Ambil Ulasan Publik untuk "Wall of Love" (Galeri Testimoni Pelanggan)
        $reviews = Review::with(['bouquet:id,title,photo_url'])
            ->where('tenant_id', $tenant->id)
            ->where('is_published', true)
            ->orderByDesc('is_featured')
            ->orderByDesc('review_date')
            ->take(12)
            ->get();

        // Agregat Statistik Toko
        $allPublishedReviews = Review::where('tenant_id', $tenant->id)->where('is_published', true)->get();
        $totalReviewsCount = $allPublishedReviews->count();
        $storeAverageRating = $totalReviewsCount > 0 ? round($allPublishedReviews->avg('rating'), 1) : 4.9;
        $satisfactionRate = $totalReviewsCount > 0
            ? round(($allPublishedReviews->where('rating', '>=', 4)->count() / $totalReviewsCount) * 100)
            : 99;

        return Inertia::render('storefront-flow/StorefrontCatalogView', [
            'tenant' => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'subdomain' => $tenant->subdomain,
                'whatsapp_number' => $tenant->whatsapp_number,
                'logo_url' => $tenant->logo_url,
                'banner_url' => $tenant->banner_url,
                'about_text' => $tenant->about_text,
                'rating_summary' => [
                    'average' => $storeAverageRating,
                    'total_count' => $totalReviewsCount,
                    'satisfaction_rate' => $satisfactionRate,
                ],
            ],
            'bouquets' => $bouquets,
            'occasions' => $occasions,
            'reviews' => $reviews,
            'activeFilters' => [
                'occasion' => $request->input('occasion', 'all'),
                'ready_only' => $request->boolean('ready_only'),
                'max_price' => $request->input('max_price', ''),
            ],
        ]);
    }

    /**
     * Submit Ulasan Publik Terverifikasi oleh Pembeli berdasarkan Order Number
     */
    public function submitCustomerReview(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'order_number' => 'required|string',
            'customer_name' => 'required|string|max:150',
            'rating' => 'required|integer|min:1|max:5',
            'review_text' => 'required|string|max:1000',
            'photo' => 'nullable|image|max:3072',
        ]);

        $order = Order::with('items')->where('order_number', $validated['order_number'])->first();
        if (!$order) {
            return redirect()->back()->withErrors(['order_number' => 'Nomor pesanan tidak ditemukan di sistem kami.']);
        }

        // Ambil buket pertama dari pesanan jika ada
        $firstItem = $order->items->first();
        $bouquetId = $firstItem?->bouquet_id;

        $photoUrl = null;
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('reviews', 'public');
            $photoUrl = Storage::url($path);
        }

        Review::create([
            'tenant_id' => $order->tenant_id,
            'bouquet_id' => $bouquetId,
            'order_id' => $order->id,
            'customer_name' => $validated['customer_name'],
            'customer_handle' => 'Order #' . substr($order->order_number, -4) . ' • Verified Buyer',
            'rating' => $validated['rating'],
            'review_text' => $validated['review_text'],
            'photo_url' => $photoUrl,
            'source' => 'verified_order',
            'is_featured' => false,
            'is_published' => true,
            'review_date' => now()->toDateString(),
        ]);

        return redirect()->back()->with('success', 'Terima kasih banyak atas ulasan tulus Anda! Bintang dan ulasan Anda telah tampil di etalase.');
    }
}
