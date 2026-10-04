export interface OccasionItem {
    id: number;
    name: string;
    slug?: string;
    emoji: string | null;
}

export interface InventoryItemOption {
    id: number;
    name: string;
    category: 'fresh_flower' | 'wrapping_paper' | 'ribbon' | 'accessory' | 'greeting_card' | string;
    unit_cost: number;
    stock_quantity: number;
    unit_measurement: string;
    photo_url: string | null;
}

export interface BouquetCompositionItem {
    id?: number;
    bouquet_id?: number;
    inventory_item_id: number;
    required_quantity: number;
    inventory_item?: InventoryItemOption;
}

export interface BouquetItem {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    selling_price: number;
    estimated_cogs: number;
    photo_url: string | null;
    is_ready_stock: boolean;
    is_active: boolean;
    is_featured: boolean;
    occasions: OccasionItem[];
    compositions: BouquetCompositionItem[];
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedBouquets {
    data: BouquetItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

export interface CatalogFilterState {
    search?: string;
    occasion_id?: string | number;
    is_ready_stock?: string;
}
