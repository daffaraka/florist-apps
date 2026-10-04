<?php

use App\Http\Controllers\FloristAdmin\FloristBouquetController;
use App\Http\Controllers\FloristAdmin\FloristDashboardController;
use App\Http\Controllers\FloristAdmin\FloristFinanceController;
use App\Http\Controllers\FloristAdmin\FloristInventoryController;
use App\Http\Controllers\FloristAdmin\FloristOrderController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('admin.dashboard');
});

// Florist Admin Module Routes (Mobile-First Dashboard)
Route::prefix('admin')->name('admin.')->group(function () {
    // 1. Dashboard Utama & Infografis
    Route::get('/dashboard', [FloristDashboardController::class, 'index'])->name('dashboard');

    // 2. Manajemen Inventori & Stok Multi-Kategori + Waste Tracker
    Route::get('/inventory', [FloristInventoryController::class, 'index'])->name('inventory.index');
    Route::get('/inventory/create', [FloristInventoryController::class, 'create'])->name('inventory.create');
    Route::post('/inventory', [FloristInventoryController::class, 'store'])->name('inventory.store');
    Route::put('/inventory/{item}', [FloristInventoryController::class, 'update'])->name('inventory.update');
    Route::post('/inventory/{item}/waste', [FloristInventoryController::class, 'recordWaste'])->name('inventory.waste');

    // 3. Katalog Bouket & Resep Komposisi (BOM)
    Route::get('/bouquets', [FloristBouquetController::class, 'index'])->name('bouquets.index');
    Route::post('/bouquets', [FloristBouquetController::class, 'store'])->name('bouquets.store');
    Route::match(['put', 'post'], '/bouquets/{bouquet}', [FloristBouquetController::class, 'update'])->name('bouquets.update');
    Route::delete('/bouquets/{bouquet}', [FloristBouquetController::class, 'destroy'])->name('bouquets.destroy');
    Route::post('/bouquets/{bouquet}/toggle', [FloristBouquetController::class, 'toggleStatus'])->name('bouquets.toggle');

    // 4. Jadwal Pesanan & Timeline Slot Jam Kirim
    Route::get('/orders', [FloristOrderController::class, 'index'])->name('orders.index');
    Route::patch('/orders/{order}/status', [FloristOrderController::class, 'updateStatus'])->name('orders.update-status');

    // 5. Keuangan (Laba Rugi Otomatis)
    Route::get('/finance', [FloristFinanceController::class, 'index'])->name('finance.index');

    // 6. Master Data (Kategori & Satuan Pengukuran Dinamis)
    Route::get('/master-data', [\App\Http\Controllers\FloristAdmin\MasterDataController::class, 'index'])->name('master-data.index');
    Route::post('/master-data/categories', [\App\Http\Controllers\FloristAdmin\MasterDataController::class, 'storeCategory'])->name('master-data.categories.store');
    Route::put('/master-data/categories/{category}', [\App\Http\Controllers\FloristAdmin\MasterDataController::class, 'updateCategory'])->name('master-data.categories.update');
    Route::delete('/master-data/categories/{category}', [\App\Http\Controllers\FloristAdmin\MasterDataController::class, 'destroyCategory'])->name('master-data.categories.destroy');
    Route::post('/master-data/quick-category', [\App\Http\Controllers\FloristAdmin\MasterDataController::class, 'quickCategory'])->name('master-data.quick-category');

    Route::post('/master-data/units', [\App\Http\Controllers\FloristAdmin\MasterDataController::class, 'storeUnit'])->name('master-data.units.store');
    Route::put('/master-data/units/{unit}', [\App\Http\Controllers\FloristAdmin\MasterDataController::class, 'updateUnit'])->name('master-data.units.update');
    Route::delete('/master-data/units/{unit}', [\App\Http\Controllers\FloristAdmin\MasterDataController::class, 'destroyUnit'])->name('master-data.units.destroy');
    Route::post('/master-data/quick-unit', [\App\Http\Controllers\FloristAdmin\MasterDataController::class, 'quickUnit'])->name('master-data.quick-unit');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
