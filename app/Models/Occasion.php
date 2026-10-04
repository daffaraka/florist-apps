<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Occasion extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'slug',
        'emoji',
    ];

    public function bouquets(): BelongsToMany
    {
        return $this->belongsToMany(Bouquet::class, 'bouquet_occasion');
    }
}
