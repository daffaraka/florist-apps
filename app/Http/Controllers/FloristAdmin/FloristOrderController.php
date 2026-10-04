<?php

namespace App\Http\Controllers\FloristAdmin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FloristOrderController extends Controller
{
    /**
     * Tampilkan jadwal pesanan (Timeline Slot Jam & Kalender)
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $selectedDate = $request->query('date', today()->toDateString());

        $orders = Order::with('items')
            ->when($status, fn($q) => $q->where('status', $status))
            ->whereDate('delivery_date', $selectedDate)
            ->orderBy('delivery_time_slot')
            ->get();

        // Rekapitulasi pesanan per slot jam
        $slotSummary = [
            'morning' => $orders->where('delivery_time_slot', 'morning_09_12')->count(),
            'afternoon' => $orders->where('delivery_time_slot', 'afternoon_13_16')->count(),
            'evening' => $orders->where('delivery_time_slot', 'evening_17_20')->count(),
        ];

        return Inertia::render('florist-admin/florist-order-timeline', [
            'orders' => $orders,
            'slot_summary' => $slotSummary,
            'selected_date' => $selectedDate,
            'current_status' => $status,
        ]);
    }

    /**
     * Update status pesanan (Konfirmasi, Sedang Dirangkai, Siap Kirim, Selesai)
     */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending_payment,confirmed,in_assembly,ready_for_delivery,delivered,cancelled',
        ]);

        $order->update($validated);

        return back()->with('success', "Status pesanan {$order->order_number} berhasil diperbarui.");
    }
}
