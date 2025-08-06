import { PostData } from "@/types/post";

export async function createPost(data: PostData): Promise<any> {
    const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create post');
    return await res.json();
}

export async function updatePost(id: string, data: PostData): Promise<any> {
    const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update post');
    return await res.json();
} 
