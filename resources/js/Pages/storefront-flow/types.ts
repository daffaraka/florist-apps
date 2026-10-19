export interface OccasionItem {
    id: number;
    name: string;
    slug: string;
    emoji?: string | null;
}

export interface StorefrontComposition {
    id: number;
    required_quantity: number;
    inventory_item?: {
        id: number;
        name: string;
        color?: string | null;
        unit_measurement?: string | null;
    } | null;
}

export interface StorefrontReview {
    id: number;
    customer_name: string;
    customer_handle?: string | null;
    rating: number;
    review_text: string;
    photo_url?: string | null;
    source: 'admin_curated' | 'verified_order';
    is_featured: boolean;
    review_date?: string | null;
    bouquet?: {
        id: number;
        title: string;
        photo_url?: string | null;
    } | null;
}

export interface StorefrontBouquet {
    id: number;
    title: string;
    slug: string;
    description?: string | null;
    selling_price: number;
    photo_url?: string | null;
    is_ready_stock: boolean;
    is_featured: boolean;
    occasions?: OccasionItem[];
    compositions?: StorefrontComposition[];
    rating_average: number;
    reviews_count: number;
    recent_reviews?: StorefrontReview[];
}

export interface RatingSummary {
    average: number;
    total_count: number;
    satisfaction_rate: number;
}

export interface StorefrontTenant {
    id: number;
    name: string;
    subdomain: string;
    whatsapp_number: string;
    logo_url?: string | null;
    banner_url?: string | null;
    about_text?: string | null;
    rating_summary: RatingSummary;
}

export interface StorefrontFilters {
    occasion: string;
    ready_only: boolean;
    max_price: string;
}

export interface OrderFormState {
    bouquet: StorefrontBouquet | null;
    customer_name: string;
    customer_whatsapp: string;
    delivery_date: string;
    delivery_time_slot: 'morning_09_12' | 'afternoon_13_16' | 'evening_17_20';
    recipient_name: string;
    recipient_phone: string;
    delivery_address: string;
    card_to: string;
    card_from: string;
    card_message: string;
    notes: string;
}
