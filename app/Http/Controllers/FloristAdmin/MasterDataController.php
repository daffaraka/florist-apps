<?php

namespace App\Http\Controllers\FloristAdmin;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Models\ItemCategory;
use App\Models\UnitMeasurement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MasterDataController extends Controller
{
    /**
     * Tampilkan halaman utama manajemen master data (Kategori & Satuan)
     */
    public function index(Request $request): Response
    {
        $tab = $request->query('tab', 'categories');
        if (!in_array($tab, ['categories', 'units'])) {
            $tab = 'categories';
        }

        $categories = ItemCategory::withCount('inventoryItems')
            ->orderByDesc('is_default')
            ->orderBy('name')
            ->get();

        $units = UnitMeasurement::withCount('inventoryItems')
            ->orderByDesc('is_default')
            ->orderBy('name')
            ->get();

        return Inertia::render('master-data/MasterDataIndex', [
            'categories' => $categories,
            'units' => $units,
            'initialTab' => $tab,
        ]);
    }

    /**
     * Simpan Kategori Baru
     */
    public function storeCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
        ]);

        $slug = Str::slug($validated['name']);

        ItemCategory::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'is_default' => false,
        ]);

        return back()->with('success', "Kategori '{$validated['name']}' berhasil ditambahkan.");
    }

    /**
     * Update Kategori
     */
    public function updateCategory(Request $request, ItemCategory $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
        ]);

        return back()->with('success', "Kategori '{$validated['name']}' berhasil diperbarui.");
    }

    /**
     * Hapus Kategori (dengan proteksi data)
     */
    public function destroyCategory(ItemCategory $category): RedirectResponse
    {
        if ($category->inventoryItems()->count() > 0) {
            return back()->withErrors([
                'error' => "Kategori '{$category->name}' tidak dapat dihapus karena masih digunakan oleh item inventori."
            ]);
        }

        $category->delete();

        return back()->with('success', "Kategori berhasil dihapus.");
    }

    /**
     * Simpan Satuan Pengukuran Baru
     */
    public function storeUnit(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'symbol' => 'required|string|max:20',
            'description' => 'nullable|string|max:255',
        ]);

        UnitMeasurement::create([
            'name' => $validated['name'],
            'symbol' => strtolower(trim($validated['symbol'])),
            'description' => $validated['description'] ?? null,
            'is_default' => false,
        ]);

        return back()->with('success', "Satuan '{$validated['name']}' berhasil ditambahkan.");
    }

    /**
     * Update Satuan Pengukuran
     */
    public function updateUnit(Request $request, UnitMeasurement $unit): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'symbol' => 'required|string|max:20',
            'description' => 'nullable|string|max:255',
        ]);

        $unit->update([
            'name' => $validated['name'],
            'symbol' => strtolower(trim($validated['symbol'])),
            'description' => $validated['description'] ?? null,
        ]);

        return back()->with('success', "Satuan '{$validated['name']}' berhasil diperbarui.");
    }

    /**
     * Hapus Satuan Pengukuran (dengan proteksi data)
     */
    public function destroyUnit(UnitMeasurement $unit): RedirectResponse
    {
        if ($unit->inventoryItems()->count() > 0) {
            return back()->withErrors([
                'error' => "Satuan '{$unit->name}' tidak dapat dihapus karena masih digunakan oleh item inventori."
            ]);
        }

        $unit->delete();

        return back()->with('success', "Satuan berhasil dihapus.");
    }

    /**
     * Quick Store Category via JSON API (Untuk tombol + pada form inventori)
     */
    public function quickCategory(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
        ]);

        $slug = Str::slug($validated['name']);

        $category = ItemCategory::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'is_default' => false,
        ]);

        return response()->json([
            'success' => true,
            'category' => $category,
            'message' => 'Kategori berhasil dibuat.',
        ]);
    }

    /**
     * Quick Store Unit via JSON API (Untuk tombol + pada form inventori)
     */
    public function quickUnit(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'symbol' => 'required|string|max:20',
            'description' => 'nullable|string|max:255',
        ]);

        $unit = UnitMeasurement::create([
            'name' => $validated['name'],
            'symbol' => strtolower(trim($validated['symbol'])),
            'description' => $validated['description'] ?? null,
            'is_default' => false,
        ]);

        return response()->json([
            'success' => true,
            'unit' => $unit,
            'message' => 'Satuan pengukuran berhasil dibuat.',
        ]);
    }
}
