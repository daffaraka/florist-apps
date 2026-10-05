<?php

namespace Database\Seeders;

use App\Models\InventoryItem;
use App\Models\ItemCategory;
use App\Models\Tenant;
use App\Models\UnitMeasurement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MasterDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tenants = Tenant::all();

        $defaultCategories = [
            ['name' => 'Bunga Segar', 'slug' => 'fresh_flower', 'description' => 'Mawar, Lily, Baby Breath, Eucalyptus, dll.'],
            ['name' => 'Kertas Wrapping', 'slug' => 'wrapping_paper', 'description' => 'Korean cellophane, spunbond, kraft paper, dll.'],
            ['name' => 'Pita Satin & Tali', 'slug' => 'ribbon', 'description' => 'Pita satin doff, grosgrain, tali rami, dll.'],
            ['name' => 'Aksesoris & Boneka', 'slug' => 'accessory', 'description' => 'Boneka wisuda, lampu LED, topper tusuk, balon mini.'],
            ['name' => 'Kartu Ucapan', 'slug' => 'greeting_card', 'description' => 'Kartu ucapan cetak, foil gold, amplop mini.'],
        ];

        $defaultUnits = [
            ['name' => 'Tangkai', 'symbol' => 'stem', 'description' => 'Satuan hitung per tangkai bunga'],
            ['name' => 'Lembar', 'symbol' => 'sheet', 'description' => 'Satuan kertas pembungkus/cellophane'],
            ['name' => 'Meter', 'symbol' => 'meter', 'description' => 'Satuan panjang pita atau tali'],
            ['name' => 'Pcs / Buah', 'symbol' => 'pcs', 'description' => 'Satuan kartu ucapan, boneka, aksesoris'],
            ['name' => 'Roll / Gulung', 'symbol' => 'roll', 'description' => 'Satuan gulungan pita atau kertas'],
            ['name' => 'Ikat / Bunch', 'symbol' => 'bunch', 'description' => 'Satuan per ikat bunga / daun'],
        ];

        foreach ($tenants as $tenant) {
            app()->instance('current_tenant_id', $tenant->id);

            $categoryMap = [];
            foreach ($defaultCategories as $cat) {
                $created = ItemCategory::firstOrCreate(
                    ['tenant_id' => $tenant->id, 'slug' => $cat['slug']],
                    [
                        'name' => $cat['name'],
                        'description' => $cat['description'],
                        'is_default' => true,
                    ]
                );
                $categoryMap[$cat['slug']] = $created->id;
            }

            $unitMap = [];
            foreach ($defaultUnits as $unit) {
                $created = UnitMeasurement::firstOrCreate(
                    ['tenant_id' => $tenant->id, 'symbol' => $unit['symbol']],
                    [
                        'name' => $unit['name'],
                        'description' => $unit['description'],
                        'is_default' => true,
                    ]
                );
                $unitMap[$unit['symbol']] = $created->id;
            }

            // Hubungkan data inventory_items yang sudah ada ke master data barunya
            $items = InventoryItem::where('tenant_id', $tenant->id)->get();
            foreach ($items as $item) {
                $catId = $categoryMap[$item->category] ?? null;
                $unitId = $unitMap[$item->unit_measurement] ?? null;

                if ($catId || $unitId) {
                    $item->update([
                        'category_id' => $catId ?: $item->category_id,
                        'unit_measurement_id' => $unitId ?: $item->unit_measurement_id,
                    ]);
                }
            }
        }
    }
}
