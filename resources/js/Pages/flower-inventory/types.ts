export type InventoryCategory = string;

export interface ItemCategory {
    id: number;
    tenant_id: number;
    name: string;
    slug: string;
    description: string | null;
    is_default: boolean;
    inventory_items_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface UnitMeasurement {
    id: number;
    tenant_id: number;
    name: string;
    symbol: string;
    description: string | null;
    is_default: boolean;
    inventory_items_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface InventoryItem {
    id: number;
    tenant_id: number;
    name: string;
    sku: string | null;
    barcode: string | null;
    category: InventoryCategory;
    category_id?: number | null;
    item_category?: ItemCategory | null;
    color: string | null;
    unit_cost: number;
    stock_quantity: number;
    unit_measurement: string;
    unit_measurement_id?: number | null;
    unit?: UnitMeasurement | null;
    shelf_life_days: number | null;
    minimum_alert_stock: number;
    photo_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface PaginatedInventoryItems {
    data: InventoryItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export type WasteReason = 
    | 'wilted' 
    | 'broken_stem' 
    | 'pest' 
    | 'damaged_packaging' 
    | 'expired' 
    | 'other';
