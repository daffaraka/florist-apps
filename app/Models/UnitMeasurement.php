<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UnitMeasurement extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'name',
        'symbol',
        'description',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function inventoryItems(): HasMany
    {
        return $this->hasMany(InventoryItem::class, 'unit_measurement_id');
    }
}
