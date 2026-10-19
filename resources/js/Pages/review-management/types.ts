export interface BouquetOption {
    id: number;
    title: string;
    selling_price?: number;
    photo_url?: string | null;
}

export interface OrderRef {
    id: number;
    order_number: string;
}

export interface ReviewItem {
    id: number;
    tenant_id: number;
    bouquet_id?: number | null;
    order_id?: number | null;
    customer_name: string;
    customer_handle?: string | null;
    rating: number;
    review_text: string;
    photo_url?: string | null;
    source: 'admin_curated' | 'verified_order';
    is_featured: boolean;
    is_published: boolean;
    review_date?: string | null;
    created_at: string;
    bouquet?: BouquetOption | null;
    order?: OrderRef | null;
}

export interface ReviewStats {
    total_reviews: number;
    average_rating: number;
    with_photos_count: number;
    verified_count: number;
}

export interface ReviewFilters {
    search?: string;
    rating?: string;
    source?: string;
    is_published?: string;
}

export interface PaginatedReviews {
    data: ReviewItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
