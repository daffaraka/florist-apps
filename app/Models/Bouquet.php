<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bouquet extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'title',
        'slug',
        'description',
        'selling_price',
        'estimated_cogs',
        'photo_url',
        'is_ready_stock',
        'is_active',
        'is_featured',
    ];

    protected $casts = [
        'selling_price' => 'decimal:2',
        'estimated_cogs' => 'decimal:2',
        'is_ready_stock' => 'boolean',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function occasions(): BelongsToMany
    {
        return $this->belongsToMany(Occasion::class, 'bouquet_occasion');
    }

    public function compositions(): HasMany
    {
        return $this->hasMany(BouquetComposition::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Hitung ulang estimasi HPP (COGS) dari resep bahan baku
     */
    public function recalculateCogs(): float
    {
        $cogs = 0;
        foreach ($this->compositions as $composition) {
            $unitCost = $composition->inventoryItem?->unit_cost ?? 0;
            $cogs += ($unitCost * $composition->required_quantity);
        }
        $this->update(['estimated_cogs' => $cogs]);
        return $cogs;
    }
}
