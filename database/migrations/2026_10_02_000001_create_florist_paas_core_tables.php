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
        // 1. Tenants & Storefront Profiles
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('subdomain')->unique();
            $table->string('custom_domain')->nullable()->unique();
            $table->string('whatsapp_number', 25)->nullable();
            $table->string('logo_url')->nullable();
            $table->string('banner_url')->nullable();
            $table->text('about_text')->nullable();
            $table->string('plan_tier')->default('basic'); // basic, pro, enterprise
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Add tenant_id & role to users
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->cascadeOnDelete();
            $table->string('role')->default('florist_owner'); // super_admin, florist_owner, florist_staff
        });

        // 2. Inventory Items (Multi-Kategori: Bunga Segar, Wrapping, Pita, Aksesoris)
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('name');
            $table->string('sku')->nullable()->index();
            $table->string('barcode')->nullable()->index();
            $table->enum('category', ['fresh_flower', 'wrapping_paper', 'ribbon', 'accessory', 'greeting_card'])->default('fresh_flower');
            $table->string('color')->nullable();
            $table->decimal('unit_cost', 12, 2)->default(0); // Harga modal (beli)
            $table->decimal('stock_quantity', 10, 2)->default(0); // Jumlah stok fisik (tangkai / lembar / meter / pcs)
            $table->string('unit_measurement', 20)->default('stem'); // stem, sheet, meter, pcs, roll
            $table->integer('shelf_life_days')->nullable(); // Masa kesegaran bunga (misal 5 hari)
            $table->integer('minimum_alert_stock')->default(5); // Alert saat stok menipis
            $table->string('photo_url')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'category']);
        });

        // 3. Flower Spoilage / Waste Tracker (Pencatatan Bunga Layu / Rusak)
        Schema::create('inventory_wastes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->cascadeOnDelete();
            $table->decimal('quantity_lost', 10, 2);
            $table->decimal('estimated_cost_loss', 12, 2); // Biaya kerugian (quantity * unit_cost)
            $table->enum('reason', ['wilted', 'broken_stem', 'pest', 'damaged_packaging', 'expired', 'other'])->default('wilted');
            $table->text('notes')->nullable();
            $table->timestamp('recorded_at')->useCurrent();
            $table->timestamps();

            $table->index(['tenant_id', 'recorded_at']);
        });

        // 4. Occasions & Moments (Wisuda, Valentine, Duka Cita, Ulang Tahun, dll)
        Schema::create('occasions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->cascadeOnDelete(); // null = platform global occasion
            $table->string('name');
            $table->string('slug')->index();
            $table->string('emoji', 20)->nullable();
            $table->timestamps();
        });

        // 5. Bouquets (Katalog Produk Jadi & Kustom)
        Schema::create('bouquets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->decimal('selling_price', 12, 2); // Harga jual ke customer
            $table->decimal('estimated_cogs', 12, 2)->default(0); // Otomatis terakumulasi dari resep bahan baku
            $table->string('photo_url')->nullable();
            $table->boolean('is_ready_stock')->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['tenant_id', 'slug']);
            $table->index(['tenant_id', 'is_active']);
        });

        // Bouquet Occasion Pivot
        Schema::create('bouquet_occasion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bouquet_id')->constrained('bouquets')->cascadeOnDelete();
            $table->foreignId('occasion_id')->constrained('occasions')->cascadeOnDelete();
        });

        // 6. Bouquet Composition / Recipe (Bill of Materials - Resep Penyusun Bouket)
        Schema::create('bouquet_compositions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bouquet_id')->constrained('bouquets')->cascadeOnDelete();
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->cascadeOnDelete();
            $table->decimal('required_quantity', 10, 2); // Berapa tangkai/lembar per bouket
            $table->timestamps();

            $table->unique(['bouquet_id', 'inventory_item_id']);
        });

        // 7. Orders & WhatsApp Checkout
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('order_number')->unique();
            $table->string('customer_name');
            $table->string('customer_whatsapp', 25);
            $table->string('recipient_name')->nullable();
            $table->string('recipient_phone', 25)->nullable();
            $table->text('delivery_address')->nullable();
            $table->date('delivery_date');
            $table->enum('delivery_time_slot', ['morning_09_12', 'afternoon_13_16', 'evening_17_20'])->default('morning_09_12');
            $table->text('greeting_card_message')->nullable();
            $table->decimal('subtotal_amount', 12, 2);
            $table->decimal('total_cogs_amount', 12, 2)->default(0); // Total modal bahan terpakai
            $table->decimal('total_profit_amount', 12, 2)->default(0); // Subtotal - total_cogs
            $table->enum('status', ['pending_payment', 'confirmed', 'in_assembly', 'ready_for_delivery', 'delivered', 'cancelled'])->default('pending_payment');
            $table->text('florist_notes')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'delivery_date']);
            $table->index(['tenant_id', 'status']);
        });

        // 8. Order Items
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('bouquet_id')->nullable()->constrained('bouquets')->nullOnDelete();
            $table->string('bouquet_title');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_selling_price', 12, 2);
            $table->decimal('unit_cogs_price', 12, 2)->default(0);
            $table->decimal('subtotal_price', 12, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('bouquet_compositions');
        Schema::dropIfExists('bouquet_occasion');
        Schema::dropIfExists('bouquets');
        Schema::dropIfExists('occasions');
        Schema::dropIfExists('inventory_wastes');
        Schema::dropIfExists('inventory_items');
        
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['tenant_id']);
            $table->dropColumn(['tenant_id', 'role']);
        });

        Schema::dropIfExists('tenants');
    }
};
