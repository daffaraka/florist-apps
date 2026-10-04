<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BouquetComposition extends Model
{
    use HasFactory;

    protected $fillable = [
        'bouquet_id',
        'inventory_item_id',
        'required_quantity',
    ];

    protected $casts = [
        'required_quantity' => 'decimal:2',
    ];

    public function bouquet(): BelongsTo
    {
        return $this->belongsTo(Bouquet::class);
    }

    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class);
    }
}
