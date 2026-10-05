<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tabel Kategori Item Inventori (Multi-tenant)
        Schema::create('item_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('slug', 100);
            $table->text('description')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->unique(['tenant_id', 'slug']);
        });

        // 2. Tabel Satuan Pengukuran (Multi-tenant)
        Schema::create('unit_measurements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('name', 50);
            $table->string('symbol', 20);
            $table->text('description')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->unique(['tenant_id', 'symbol']);
        });

        // 3. Tambahkan kolom relasi ke inventory_items
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('barcode')->constrained('item_categories')->nullOnDelete();
            $table->foreignId('unit_measurement_id')->nullable()->after('stock_quantity')->constrained('unit_measurements')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropForeign(['unit_measurement_id']);
            $table->dropColumn(['category_id', 'unit_measurement_id']);
        });

        Schema::dropIfExists('unit_measurements');
        Schema::dropIfExists('item_categories');
    }
};
