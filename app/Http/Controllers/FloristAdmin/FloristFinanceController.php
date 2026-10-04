<?php

namespace App\Http\Controllers\FloristAdmin;

use App\Http\Controllers\Controller;
use App\Models\InventoryWaste;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FloristFinanceController extends Controller
{
    /**
     * Tampilkan laporan Laba Rugi Otomatis (Omzet, HPP Bahan, Margin per Produk, Susut Kerugian)
     */
    public function index(Request $request): Response
    {
        $period = $request->query('period', 'this_month'); // today, this_week, this_month, all_time

        $orderQuery = Order::where('status', '!=', 'cancelled');
        $wasteQuery = InventoryWaste::query();

        if ($period === 'today') {
            $orderQuery->whereDate('created_at', today());
            $wasteQuery->whereDate('recorded_at', today());
        } elseif ($period === 'this_week') {
            $orderQuery->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
            $wasteQuery->whereBetween('recorded_at', [now()->startOfWeek(), now()->endOfWeek()]);
        } elseif ($period === 'this_month') {
            $orderQuery->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year);
            $wasteQuery->whereMonth('recorded_at', now()->month)->whereYear('recorded_at', now()->year);
        }

        $totalRevenue = (float) $orderQuery->sum('subtotal_amount');
        $totalCogs = (float) $orderQuery->sum('total_cogs_amount');
        $grossProfit = $totalRevenue - $totalCogs;
        $totalWasteLoss = (float) $wasteQuery->sum('estimated_cost_loss');
        $netProfit = $grossProfit - $totalWasteLoss;

        $profitMarginPercentage = $totalRevenue > 0 ? round(($netProfit / $totalRevenue) * 100, 1) : 0;

        // Riwayat transaksi beserta profit masing-masing
        $recentTransactions = $orderQuery->with('items')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get(['id', 'order_number', 'customer_name', 'subtotal_amount', 'total_cogs_amount', 'total_profit_amount', 'status', 'created_at']);

        // Rincian kerugian bunga layu / rusak
        $recentWastes = $wasteQuery->with('inventoryItem')
            ->orderByDesc('recorded_at')
            ->limit(5)
            ->get();

        return Inertia::render('florist-admin/florist-finance-summary', [
            'summary' => [
                'total_revenue' => $totalRevenue,
                'total_cogs' => $totalCogs,
                'gross_profit' => $grossProfit,
                'total_waste_loss' => $totalWasteLoss,
                'net_profit' => $netProfit,
                'profit_margin_percentage' => $profitMarginPercentage,
            ],
            'recent_transactions' => $recentTransactions,
            'recent_wastes' => $recentWastes,
            'current_period' => $period,
        ]);
    }
}
