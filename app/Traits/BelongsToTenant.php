<?php

namespace App\Traits;

use App\Models\Tenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        // Global scope: Hanya mengambil data milik tenant aktif jika tenant context terpasang
        static::addGlobalScope('tenant_isolation', function (Builder $builder) {
            $currentTenantId = app()->bound('current_tenant_id') ? app('current_tenant_id') : null;

            if ($currentTenantId) {
                $builder->where($builder->getModel()->getTable() . '.tenant_id', $currentTenantId);
            }
        });

        // Event saat membuat data baru: otomatis pasang tenant_id
        static::creating(function (Model $model) {
            $currentTenantId = app()->bound('current_tenant_id') ? app('current_tenant_id') : null;

            if ($currentTenantId && empty($model->tenant_id)) {
                $model->tenant_id = $currentTenantId;
            }
        });
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
