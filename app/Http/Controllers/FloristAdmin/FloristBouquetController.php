<?php

namespace App\Http\Controllers\FloristAdmin;

use App\Http\Controllers\Controller;
use App\Models\Bouquet;
use App\Models\BouquetComposition;
use App\Models\InventoryItem;
use App\Models\Occasion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class FloristBouquetController extends Controller
{
    /**
     * Tampilkan katalog buket toko (Owner Control Panel)
     */
    public function index(Request $request): Response
    {
        $query = Bouquet::with(['occasions', 'compositions.inventoryItem'])
            ->orderByDesc('is_featured')
            ->orderByDesc('id');

        // Optional search filter
        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        // Optional occasion filter
        if ($occasionId = $request->input('occasion_id')) {
            $query->whereHas('occasions', function ($q) use ($occasionId) {
                $q->where('occasions.id', $occasionId);
            });
        }

        // Optional stock status filter
        if ($request->filled('is_ready_stock')) {
            $query->where('is_ready_stock', filter_var($request->input('is_ready_stock'), FILTER_VALIDATE_BOOLEAN));
        }

        $bouquets = $query->paginate(12)->withQueryString();

        $availableItems = InventoryItem::select(
            'id',
            'name',
            'category',
            'unit_cost',
            'stock_quantity',
            'unit_measurement',
            'photo_url'
        )->orderBy('name')->get();

        $occasions = Occasion::orderBy('name')->get();

        return Inertia::render('bouquet-catalog/BouquetCatalogList', [
            'bouquets' => $bouquets,
            'available_items' => $availableItems,
            'occasions' => $occasions,
            'filters' => $request->only(['search', 'occasion_id', 'is_ready_stock']),
        ]);
    }

    /**
     * Simpan buket baru beserta resep Bill of Materials (BOM)
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'selling_price' => 'required|numeric|min:0',
            'is_ready_stock' => 'boolean',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'photo' => 'nullable|image|max:3072',
            'photo_url' => 'nullable|string|max:500',
            'occasion_ids' => 'nullable|array',
            'occasion_ids.*' => 'exists:occasions,id',
            'compositions' => 'required|array|min:1',
            'compositions.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'compositions.*.required_quantity' => 'required|numeric|min:0.1',
        ]);

        // Cek limit featured pin (maks 3)
        if (!empty($validated['is_featured'])) {
            $featuredCount = Bouquet::where('is_featured', true)->count();
            if ($featuredCount >= 3) {
                return back()->withErrors(['is_featured' => 'Maksimal 3 buket yang dapat disematkan sebagai produk unggulan (Featured Pin).']);
            }
        }

        DB::transaction(function () use ($request, $validated) {
            $photoPath = $validated['photo_url'] ?? null;
            if ($request->hasFile('photo')) {
                $file = $request->file('photo');
                $storedPath = $file->store('bouquets', 'public');
                $photoPath = '/storage/' . $storedPath;
            }

            $bouquet = Bouquet::create([
                'title' => $validated['title'],
                'slug' => Str::slug($validated['title']) . '-' . Str::random(5),
                'description' => $validated['description'] ?? null,
                'selling_price' => $validated['selling_price'],
                'photo_url' => $photoPath,
                'is_ready_stock' => $validated['is_ready_stock'] ?? true,
                'is_active' => $validated['is_active'] ?? true,
                'is_featured' => $validated['is_featured'] ?? false,
            ]);

            if (!empty($validated['occasion_ids'])) {
                $bouquet->occasions()->sync($validated['occasion_ids']);
            }

            foreach ($validated['compositions'] as $comp) {
                BouquetComposition::create([
                    'bouquet_id' => $bouquet->id,
                    'inventory_item_id' => $comp['inventory_item_id'],
                    'required_quantity' => $comp['required_quantity'],
                ]);
            }

            $bouquet->recalculateCogs();
        });

        return back()->with('success', 'Buket baru dan resep bahan berhasil disimpan ke katalog.');
    }

    /**
     * Perbarui data buket dan komposisi resep bahan
     */
    public function update(Request $request, Bouquet $bouquet): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'selling_price' => 'required|numeric|min:0',
            'is_ready_stock' => 'boolean',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'photo' => 'nullable|image|max:3072',
            'photo_url' => 'nullable|string|max:500',
            'occasion_ids' => 'nullable|array',
            'occasion_ids.*' => 'exists:occasions,id',
            'compositions' => 'required|array|min:1',
            'compositions.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'compositions.*.required_quantity' => 'required|numeric|min:0.1',
        ]);

        if (!empty($validated['is_featured']) && !$bouquet->is_featured) {
            $featuredCount = Bouquet::where('is_featured', true)->where('id', '!=', $bouquet->id)->count();
            if ($featuredCount >= 3) {
                return back()->withErrors(['is_featured' => 'Maksimal 3 buket yang dapat disematkan sebagai produk unggulan (Featured Pin).']);
            }
        }

        DB::transaction(function () use ($request, $validated, $bouquet) {
            $photoPath = $bouquet->photo_url;
            if ($request->hasFile('photo')) {
                // Hapus foto lama jika tersimpan di local public disk
                $this->deleteStoredPhoto($bouquet->photo_url);
                $file = $request->file('photo');
                $storedPath = $file->store('bouquets', 'public');
                $photoPath = '/storage/' . $storedPath;
            } elseif ($request->filled('photo_url')) {
                $photoPath = $validated['photo_url'];
            }

            $bouquet->update([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'selling_price' => $validated['selling_price'],
                'photo_url' => $photoPath,
                'is_ready_stock' => $validated['is_ready_stock'] ?? $bouquet->is_ready_stock,
                'is_active' => $validated['is_active'] ?? $bouquet->is_active,
                'is_featured' => $validated['is_featured'] ?? $bouquet->is_featured,
            ]);

            $bouquet->occasions()->sync($validated['occasion_ids'] ?? []);

            // Perbarui komposisi bahan
            $bouquet->compositions()->delete();
            foreach ($validated['compositions'] as $comp) {
                BouquetComposition::create([
                    'bouquet_id' => $bouquet->id,
                    'inventory_item_id' => $comp['inventory_item_id'],
                    'required_quantity' => $comp['required_quantity'],
                ]);
            }

            $bouquet->recalculateCogs();
        });

        return back()->with('success', 'Buket berhasil diperbarui.');
    }

    /**
     * Hapus buket dari katalog
     */
    public function destroy(Bouquet $bouquet): RedirectResponse
    {
        $this->deleteStoredPhoto($bouquet->photo_url);
        $bouquet->delete();

        return back()->with('success', 'Buket berhasil dihapus dari katalog.');
    }

    /**
     * Quick toggle status buket (is_active, is_ready_stock, atau is_featured)
     */
    public function toggleStatus(Request $request, Bouquet $bouquet): RedirectResponse
    {
        $validated = $request->validate([
            'field' => 'required|in:is_active,is_ready_stock,is_featured',
        ]);

        $field = $validated['field'];

        // Proteksi limit pin featured maksimal 3
        if ($field === 'is_featured' && !$bouquet->is_featured) {
            $featuredCount = Bouquet::where('is_featured', true)->where('id', '!=', $bouquet->id)->count();
            if ($featuredCount >= 3) {
                return back()->with('error', 'Maksimal 3 buket yang dapat disematkan sebagai produk unggulan (Featured Pin).');
            }
        }

        $bouquet->update([
            $field => !$bouquet->$field,
        ]);

        $labels = [
            'is_active' => 'Visibilitas etalase',
            'is_ready_stock' => 'Status ketersediaan stok',
            'is_featured' => 'Status produk unggulan',
        ];

        return back()->with('success', ($labels[$field] ?? 'Status') . ' berhasil diperbarui.');
    }

    /**
     * Hapus file foto dari disk public bila ada
     */
    private function deleteStoredPhoto(?string $photoUrl): void
    {
        if ($photoUrl && str_starts_with($photoUrl, '/storage/bouquets/')) {
            $relativePath = str_replace('/storage/', '', $photoUrl);
            if (Storage::disk('public')->exists($relativePath)) {
                Storage::disk('public')->delete($relativePath);
            }
        }
    }
}
