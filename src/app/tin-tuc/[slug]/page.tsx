import PostPreviewClient from '@/components/post/PostPreviewClient';

export default function Page({ params }: { params: { slug: string } }) {
    return <PostPreviewClient slug={params.slug} />;
} 
