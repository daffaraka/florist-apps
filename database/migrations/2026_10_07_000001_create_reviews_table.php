<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('bouquet_id')->nullable()->constrained('bouquets')->nullOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->string('customer_name', 150);
            $table->string('customer_handle', 100)->nullable();
            $table->unsignedTinyInteger('rating')->default(5);
            $table->text('review_text');
            $table->string('photo_url')->nullable();
            $table->string('source', 30)->default('admin_curated'); // 'admin_curated' | 'verified_order'
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->date('review_date')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'is_published']);
            $table->index('bouquet_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
