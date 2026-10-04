<?php

namespace App\Http\Controllers\FloristAdmin;

use App\Http\Controllers\Controller;
use App\Models\Bouquet;
use App\Models\InventoryItem;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FloristDashboardController extends Controller
{
    /**
     * Tampilkan data dashboard utama (4 Kartu KPI + 3 Infografis Recharts)
     */
    public function index(Request $request): Response
    {
        // 1. Hitung 4 Metrik KPI Utama
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('subtotal_amount');
        $totalCogs = Order::where('status', '!=', 'cancelled')->sum('total_cogs_amount');
        $totalNetProfit = $totalRevenue - $totalCogs;
        $ordersTodayCount = Order::whereDate('created_at', today())->count();
        $lowStockCount = InventoryItem::whereColumn('stock_quantity', '<=', 'minimum_alert_stock')->count();

        // 2. Infografis: Top 5 Bouket Terlaris
        $topBouquets = Bouquet::select('id', 'title', 'selling_price', 'estimated_cogs')
            ->withCount('orderItems')
            ->orderByDesc('order_items_count')
            ->limit(5)
            ->get()
            ->map(fn($item) => [
                'name' => $item->title,
                'sold' => $item->order_items_count,
                'price' => (float) $item->selling_price,
                'profit' => (float) ($item->selling_price - $item->estimated_cogs),
            ]);

        // 3. Infografis: Tren Penjualan Harian (7 Hari Terakhir)
        $salesTrend = Order::where('status', '!=', 'cancelled')
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->get()
            ->groupBy(fn($order) => $order->created_at->format('d M'))
            ->map(fn($orders, $date) => [
                'date' => $date,
                'revenue' => (float) $orders->sum('subtotal_amount'),
                'profit' => (float) $orders->sum('total_profit_amount'),
            ])
            ->values();

        // 4. Infografis: Distribusi Momen / Occasion
        $occasionDistribution = Bouquet::with('occasions')
            ->get()
            ->flatMap(fn($b) => $b->occasions)
            ->groupBy('name')
            ->map(fn($group, $name) => [
                'name' => $name,
                'count' => $group->count(),
            ])
            ->values();

        // 5. Daftar Bahan Baku Kritis untuk Alert Cepat
        $lowStockItems = InventoryItem::whereColumn('stock_quantity', '<=', 'minimum_alert_stock')
            ->select('id', 'name', 'category', 'stock_quantity', 'unit_measurement', 'minimum_alert_stock')
            ->limit(4)
            ->get();

        return Inertia::render('florist-admin/FloristAdminDashboard', [
            'metrics' => [
                'total_revenue' => (float) $totalRevenue,
                'total_net_profit' => (float) $totalNetProfit,
                'orders_today' => $ordersTodayCount,
                'low_stock_count' => $lowStockCount,
            ],
            'infographics' => [
                'top_bouquets' => $topBouquets,
                'sales_trend' => $salesTrend,
                'occasion_distribution' => $occasionDistribution,
            ],
            'low_stock_items' => $lowStockItems,
        ]);
    }
}
