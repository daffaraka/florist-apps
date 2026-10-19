<?php

namespace App\Http\Controllers\FloristAdmin;

use App\Http\Controllers\Controller;
use App\Models\Bouquet;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FloristReviewController extends Controller
{
    /**
     * Tampilkan daftar ulasan & testimoni pelanggan (Owner Management)
     */
    public function index(Request $request): Response
    {
        $query = Review::with(['bouquet:id,title,photo_url', 'order:id,order_number'])
            ->orderByDesc('is_featured')
            ->orderByDesc('review_date')
            ->orderByDesc('id');

        // Filter Pencarian Teks
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                    ->orWhere('review_text', 'like', "%{$search}%")
                    ->orWhere('customer_handle', 'like', "%{$search}%");
            });
        }

        // Filter Rating
        if ($request->filled('rating') && $request->input('rating') !== 'all') {
            $query->where('rating', (int) $request->input('rating'));
        }

        // Filter Sumber (Admin Curated vs Verified Order)
        if ($request->filled('source') && $request->input('source') !== 'all') {
            $query->where('source', $request->input('source'));
        }

        // Filter Status Publikasi
        if ($request->filled('is_published') && $request->input('is_published') !== 'all') {
            $query->where('is_published', filter_var($request->input('is_published'), FILTER_VALIDATE_BOOLEAN));
        }

        $reviews = $query->paginate(12)->withQueryString();

        // Hitung Statistik KPI
        $allReviews = Review::all();
        $totalReviews = $allReviews->count();
        $averageRating = $totalReviews > 0 ? round($allReviews->avg('rating'), 1) : 5.0;
        $withPhotosCount = $allReviews->whereNotNull('photo_url')->count();
        $verifiedCount = $allReviews->where('source', 'verified_order')->count();

        // Daftar buket aktif untuk opsi dropdown penugasan review manual
        $availableBouquets = Bouquet::select('id', 'title', 'selling_price', 'photo_url')
            ->where('is_active', true)
            ->orderBy('title')
            ->get();

        return Inertia::render('review-management/ReviewManagementList', [
            'reviews' => $reviews,
            'filters' => $request->only(['search', 'rating', 'source', 'is_published']),
            'stats' => [
                'total_reviews' => $totalReviews,
                'average_rating' => $averageRating,
                'with_photos_count' => $withPhotosCount,
                'verified_count' => $verifiedCount,
            ],
            'availableBouquets' => $availableBouquets,
        ]);
    }

    /**
     * Tambahkan ulasan baru secara manual oleh Admin (Kurasi Testimoni / Chat WA)
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:150',
            'customer_handle' => 'nullable|string|max:100',
            'bouquet_id' => 'nullable|exists:bouquets,id',
            'rating' => 'required|integer|min:1|max:5',
            'review_text' => 'required|string',
            'review_date' => 'nullable|date',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'photo' => 'nullable|image|max:3072',
            'photo_url' => 'nullable|url|max:500',
        ]);

        $photoUrl = $validated['photo_url'] ?? null;

        // Upload berkas foto jika ada
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('reviews', 'public');
            $photoUrl = Storage::url($path);
        }

        Review::create([
            'tenant_id' => auth()->user()?->tenant_id ?? \App\Models\Tenant::first()?->id,
            'customer_name' => $validated['customer_name'],
            'customer_handle' => $validated['customer_handle'] ?? 'Via WhatsApp',
            'bouquet_id' => $validated['bouquet_id'] ?? null,
            'order_id' => null,
            'rating' => $validated['rating'],
            'review_text' => $validated['review_text'],
            'photo_url' => $photoUrl,
            'source' => 'admin_curated',
            'is_featured' => $request->boolean('is_featured', false),
            'is_published' => $request->boolean('is_published', true),
            'review_date' => $validated['review_date'] ?? now()->toDateString(),
        ]);

        return redirect()->back()->with('success', 'Ulasan berhasil ditambahkan dan disimpan!');
    }

    /**
     * Perbarui data ulasan
     */
    public function update(Request $request, Review $review): RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:150',
            'customer_handle' => 'nullable|string|max:100',
            'bouquet_id' => 'nullable|exists:bouquets,id',
            'rating' => 'required|integer|min:1|max:5',
            'review_text' => 'required|string',
            'review_date' => 'nullable|date',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'photo' => 'nullable|image|max:3072',
            'photo_url' => 'nullable|string|max:500',
        ]);

        $photoUrl = $review->photo_url;

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('reviews', 'public');
            $photoUrl = Storage::url($path);
        } elseif ($request->filled('photo_url')) {
            $photoUrl = $validated['photo_url'];
        }

        $review->update([
            'customer_name' => $validated['customer_name'],
            'customer_handle' => $validated['customer_handle'] ?? $review->customer_handle,
            'bouquet_id' => $validated['bouquet_id'] ?? null,
            'rating' => $validated['rating'],
            'review_text' => $validated['review_text'],
            'photo_url' => $photoUrl,
            'is_featured' => $request->boolean('is_featured'),
            'is_published' => $request->boolean('is_published'),
            'review_date' => $validated['review_date'] ?? $review->review_date,
        ]);

        return redirect()->back()->with('success', 'Ulasan berhasil diperbarui!');
    }

    /**
     * Toggle status publikasi ulasan (terlihat di etalase atau tidak)
     */
    public function togglePublished(Review $review): RedirectResponse
    {
        $review->update([
            'is_published' => !$review->is_published,
        ]);

        $status = $review->is_published ? 'dipublikasikan ke etalase' : 'disembunyikan dari etalase';
        return redirect()->back()->with('success', "Status ulasan berhasil {$status}.");
    }

    /**
     * Toggle status featured ulasan (tampil di Wall of Love sorotan)
     */
    public function toggleFeatured(Review $review): RedirectResponse
    {
        $review->update([
            'is_featured' => !$review->is_featured,
        ]);

        $status = $review->is_featured ? 'dijadikan ulasan unggulan' : 'dihapus dari unggulan';
        return redirect()->back()->with('success', "Ulasan berhasil {$status}.");
    }

    /**
     * Hapus ulasan
     */
    public function destroy(Review $review): RedirectResponse
    {
        $review->delete();

        return redirect()->back()->with('success', 'Ulasan berhasil dihapus.');
    }
}
