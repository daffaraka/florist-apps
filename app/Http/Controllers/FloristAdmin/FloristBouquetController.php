<?php

namespace App\Http\Controllers\FloristAdmin;

use App\Http\Controllers\Controller;
use App\Models\Bouquet;
use App\Models\BouquetComposition;
use App\Models\InventoryItem;
use App\Models\Occasion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class FloristBouquetController extends Controller
{
    /**
     * Tampilkan katalog bouket toko
     */
    public function index(Request $request): Response
    {
        $bouquets = Bouquet::with(['occasions', 'compositions.inventoryItem'])
            ->orderByDesc('id')
            ->paginate(10);

        $availableItems = InventoryItem::select('id', 'name', 'category', 'unit_cost', 'stock_quantity', 'unit_measurement')
            ->orderBy('name')
            ->get();

        $occasions = Occasion::all();

        return Inertia::render('florist-admin/florist-bouquet-catalog', [
            'bouquets' => $bouquets,
            'available_items' => $availableItems,
            'occasions' => $occasions,
        ]);
    }

    /**
     * Simpan bouket baru beserta resep Bill of Materials (BOM)
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'selling_price' => 'required|numeric|min:0',
            'is_ready_stock' => 'boolean',
            'is_active' => 'boolean',
            'occasion_ids' => 'array',
            'occasion_ids.*' => 'exists:occasions,id',
            'compositions' => 'required|array|min:1',
            'compositions.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'compositions.*.required_quantity' => 'required|numeric|min:0.1',
        ]);

        $bouquet = Bouquet::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(4),
            'description' => $validated['description'] ?? null,
            'selling_price' => $validated['selling_price'],
            'is_ready_stock' => $validated['is_ready_stock'] ?? true,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        if (!empty($validated['occasion_ids'])) {
            $bouquet->occasions()->sync($validated['occasion_ids']);
        }

        // Simpan resep bahan penyusun
        foreach ($validated['compositions'] as $comp) {
            BouquetComposition::create([
                'bouquet_id' => $bouquet->id,
                'inventory_item_id' => $comp['inventory_item_id'],
                'required_quantity' => $comp['required_quantity'],
            ]);
        }

        // Kalkulasi HPP bahan otomatis
        $bouquet->recalculateCogs();

        return back()->with('success', 'Bouket dan resep komposisi berhasil dibuat.');
    }

    /**
     * Update status bouket (Aktif / Non-aktif)
     */
    public function toggleStatus(Bouquet $bouquet): RedirectResponse
    {
        $bouquet->update([
            'is_active' => !$bouquet->is_active,
        ]);

        return back()->with('success', 'Status bouket berhasil diperbarui.');
    }
}
