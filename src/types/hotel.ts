export interface Hotel {
    _id: string;
    document_id: string;
    displayName: string;
    region: string;
    starRating: string;
    userRating: string;
    numReviews: string;
    userRatingInfo: string;
    latitude: string;
    longitude: string;
    price: string;
    imageUrl: string;
    imageUrls: string[];
    hotelFeatures: string[];
    slug: string;
    is_active: boolean;
    createdAt?: string;
    updatedAt?: string;
    description?: string;
}

export type HotelFormState = {
    displayName: string;
    region: string;
    starRating: string;
    userRating: string;
    numReviews: string;
    userRatingInfo: string;
    price: string;
    hotelFeatures: string;
    slug: string;
    is_active: boolean;
    latitude: string;
    longitude: string;
    satisfactionInfo: string;
    description?: string;
};
