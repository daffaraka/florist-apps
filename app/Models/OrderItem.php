<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'bouquet_id',
        'bouquet_title',
        'quantity',
        'unit_selling_price',
        'unit_cogs_price',
        'subtotal_price',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_selling_price' => 'decimal:2',
        'unit_cogs_price' => 'decimal:2',
        'subtotal_price' => 'decimal:2',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function bouquet(): BelongsTo
    {
        return $this->belongsTo(Bouquet::class);
    }
}
