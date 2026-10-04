<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryWaste extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'inventory_item_id',
        'quantity_lost',
        'estimated_cost_loss',
        'reason',
        'notes',
        'recorded_at',
    ];

    protected $casts = [
        'quantity_lost' => 'decimal:2',
        'estimated_cost_loss' => 'decimal:2',
        'recorded_at' => 'datetime',
    ];

    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class);
    }
}
