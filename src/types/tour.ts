export interface Tour {
    tourId: string;
    title: string;
    description: string;
    tags?: string[];
    storageSubPath: string;
    status?: string;
    createdAt?: string;
    type: 'main_banner' | 'explore_tour';
} 
