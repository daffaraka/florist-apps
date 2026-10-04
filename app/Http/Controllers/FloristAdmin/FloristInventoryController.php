<?php

namespace App\Http\Controllers\FloristAdmin;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Models\InventoryWaste;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FloristInventoryController extends Controller
{
    /**
     * Tampilkan daftar inventori multi-kategori
     */
    public function index(Request $request): Response
    {
        $category = $request->query('category');
        $search = $request->query('search');

        $items = InventoryItem::query()
            ->when($category, fn($q) => $q->where('category', $category))
            ->when($search, fn($q) => $q->where(function($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('sku', 'like', "%{$search}%")
                      ->orWhere('barcode', 'like', "%{$search}%");
            }))
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('florist-admin/florist-inventory-list', [
            'items' => $items,
            'filters' => [
                'category' => $category,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Simpan item inventori baru
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:50',
            'barcode' => 'nullable|string|max:50',
            'category' => 'required|in:fresh_flower,wrapping_paper,ribbon,accessory,greeting_card',
            'color' => 'nullable|string|max:50',
            'unit_cost' => 'required|numeric|min:0',
            'stock_quantity' => 'required|numeric|min:0',
            'unit_measurement' => 'required|string|max:20',
            'shelf_life_days' => 'nullable|integer|min:1',
            'minimum_alert_stock' => 'required|integer|min:1',
        ]);

        InventoryItem::create($validated);

        return back()->with('success', 'Bahan inventori berhasil ditambahkan.');
    }

    /**
     * Update stok cepat / harga modal
     */
    public function update(Request $request, InventoryItem $item): RedirectResponse
    {
        $validated = $request->validate([
            'stock_quantity' => 'required|numeric|min:0',
            'unit_cost' => 'required|numeric|min:0',
            'minimum_alert_stock' => 'required|integer|min:1',
        ]);

        $item->update($validated);

        return back()->with('success', 'Data stok inventori berhasil diperbarui.');
    }

    /**
     * Single-Tap Waste Action: Catat bunga rusak / layu dan potong stok fisik
     */
    public function recordWaste(Request $request, InventoryItem $item): RedirectResponse
    {
        $validated = $request->validate([
            'quantity_lost' => 'required|numeric|min:0.5|max:' . $item->stock_quantity,
            'reason' => 'required|in:wilted,broken_stem,pest,damaged_packaging,expired,other',
            'notes' => 'nullable|string|max:255',
        ]);

        $quantityLost = (float) $validated['quantity_lost'];
        $costLoss = $quantityLost * (float) $item->unit_cost;

        // Catat kerugian di tabel wastes
        InventoryWaste::create([
            'inventory_item_id' => $item->id,
            'quantity_lost' => $quantityLost,
            'estimated_cost_loss' => $costLoss,
            'reason' => $validated['reason'],
            'notes' => $validated['notes'] ?? null,
            'recorded_at' => now(),
        ]);

        // Potong stok fisik bunga
        $item->decrement('stock_quantity', $quantityLost);

        return back()->with('success', "Berhasil mencatat {$quantityLost} {$item->unit_measurement} rusak/layu.");
    }
}
