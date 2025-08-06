export interface ContentBlock {
    type: 'heading' | 'image' | 'paragraph';
    text?: string;
    src?: string;
    alt?: string;
}

export interface AddPostFormProps {
    onSuccess?: () => void;
    showForm?: boolean;
    setShowForm?: (show: boolean) => void;
    initialData?: any;
    onClose?: () => void;
    children?: React.ReactNode;
}

export interface UploadFileResponse {
    url: string;
    [key: string]: any;
}

export interface UploadFileParams {
    file: File;
    context: string;
    entityId: string;
    type: string;
    position: string;
}

export interface PostData {
    title: string;
    image: string;
    author: string;
    status: string;
    content: ContentBlock[];
    date?: string;
    [key: string]: any;
} 
