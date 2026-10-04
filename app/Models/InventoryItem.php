<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryItem extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'name',
        'sku',
        'barcode',
        'category',
        'color',
        'unit_cost',
        'stock_quantity',
        'unit_measurement',
        'shelf_life_days',
        'minimum_alert_stock',
        'photo_url',
    ];

    protected $casts = [
        'unit_cost' => 'decimal:2',
        'stock_quantity' => 'decimal:2',
        'shelf_life_days' => 'integer',
        'minimum_alert_stock' => 'integer',
    ];

    public function wastes(): HasMany
    {
        return $this->hasMany(InventoryWaste::class);
    }

    public function bouquetCompositions(): HasMany
    {
        return $this->hasMany(BouquetComposition::class);
    }

    public function isLowStock(): bool
    {
        return $this->stock_quantity <= $this->minimum_alert_stock;
    }
}
