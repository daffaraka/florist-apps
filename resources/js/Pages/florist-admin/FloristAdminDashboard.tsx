import React from 'react';
import { Head } from '@inertiajs/react';
import FloristAdminLayout from '@/Layouts/FloristAdminLayout';
import FloristKpiCards from './components/FloristKpiCards';
import FloristInfographicsCharts from './components/FloristInfographicsCharts';
import FloristLowStockAlertTable from './components/FloristLowStockAlertTable';

interface DashboardProps {
    metrics: {
        total_revenue: number;
        total_net_profit: number;
        orders_today: number;
        low_stock_count: number;
    };
    infographics: {
        top_bouquets: Array<{ name: string; sold: number; price: number; profit: number }>;
        sales_trend: Array<{ date: string; revenue: number; profit: number }>;
        occasion_distribution: Array<{ name: string; count: number }>;
    };
    low_stock_items: Array<{
        id: number;
        name: string;
        category: string;
        stock_quantity: number;
        unit_measurement: string;
        minimum_alert_stock: number;
    }>;
}

export default function FloristAdminDashboard({ metrics, infographics, low_stock_items }: DashboardProps) {
    return (
        <FloristAdminLayout title="Ringkasan Bisnis & Infografis">
            <Head title="Dashboard Florist Admin" />

            {/* 1. 4 Kartu KPI Utama */}
            <FloristKpiCards metrics={metrics} />

            {/* 2. Visual Infografis Recharts */}
            <FloristInfographicsCharts infographics={infographics} />

            {/* 3. Peringatan Stok Kritis */}
            <FloristLowStockAlertTable items={low_stock_items} />
        </FloristAdminLayout>
    );
}
