export interface BannerContent {
    title: string;
    description?: string;
    url: string; // ảnh hoặc video
    buttonText?: string;
    buttonUrl?: string;
}

export interface Display {
    startDate: string;
    endDate: string;
    isVisible: boolean;
}

export interface Banner {
    id?: string;
    name: string;
    type: string;
    position: BannerPosition | string;
    content: BannerContent;
    language: string;
    isActive: boolean;
    order: number;
    display: Display;
    group: string;
    createdAt?: string;
    updatedAt?: string;
}

export type BannerPosition =
    | 'header_banner_1'
    | 'header_banner_2'
    | 'header_banner_3'
    | 'header_banner_4'
    | 'header_banner_5'
    | 'home_video_banner'
    | 'home_image_banner';

export interface CreateBannerRequest {
    name: string;
    type: string;
    position: BannerPosition | string;
    content: BannerContent;
    language: string;
    isActive: boolean;
    order: number;
    display: Display;
    group: string;
}

export interface UpdateBannerRequest extends Partial<CreateBannerRequest> {
    id: string;
}

export interface BannerResponse {
    success: boolean;
    data: Banner | Banner[];
    message?: string;
} 
