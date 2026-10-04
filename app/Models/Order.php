<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'order_number',
        'customer_name',
        'customer_whatsapp',
        'recipient_name',
        'recipient_phone',
        'delivery_address',
        'delivery_date',
        'delivery_time_slot',
        'greeting_card_message',
        'subtotal_amount',
        'total_cogs_amount',
        'total_profit_amount',
        'status',
        'florist_notes',
    ];

    protected $casts = [
        'delivery_date' => 'date',
        'subtotal_amount' => 'decimal:2',
        'total_cogs_amount' => 'decimal:2',
        'total_profit_amount' => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
