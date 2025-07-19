"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Loader from "@/components/loader/page";
import Image from 'next/image';

export default function PostPreviewClient({ slug }: { slug: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [post, setPost] = useState<any>(null);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/blogs/slug/${encodeURIComponent(slug)}`)
            .then(res => res.json())
            .then(data => {
                if (data?.data) {
                    setPost(data.data);
                } else {
                    setPost(null);
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Lỗi khi tải dữ liệu bài viết");
                setLoading(false);
            });
    }, [slug]);

    if (loading) return <Loader />;
    if (error) return <div>{error}</div>;
    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <p className="text-xl text-red-600 font-semibold">Bài viết không tồn tại.</p>
                <button onClick={() => router.push('/cms/tin-tuc')} className="mt-4 px-4 py-2 rounded bg-blue-600 text-white">Quay lại</button>
            </div>
        );
    }

    function formatDate(dateString: string) {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
            <button onClick={() => router.push('/cms/tin-tuc')} className="mb-4 px-4 py-2 rounded bg-blue-200 text-gray-700 hover:bg-gray-300">← Quay lại</button>
            {post.image && (
                <Image
                    src={post.image}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                    priority
                />
            )}
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="flex gap-4 text-sm text-gray-500 mb-4">
                <span>Ngày đăng: {formatDate(post.date)}</span>
                <span>Trạng thái: {{
                    published: 'Đã đăng',
                    draft: 'Nháp',
                    archived: 'Đã lưu trữ',
                }[String(post.status)] || post.status}</span>
                <span>Tác giả: {post.author}</span>
            </div>
            {post?.content?.map((section: any, idx: number) => {
                if (section.type === "heading") return <h2 key={idx} className="text-xl font-bold mt-6 mb-2">{section.text}</h2>;
                if (section.type === "image") return (
                    <Image
                        key={idx}
                        src={section.src}
                        alt={section.alt}
                        width={800}
                        height={600}
                        className="w-full rounded-lg my-4"
                        loading="lazy"
                    />
                );
                if (section.type === "paragraph") return <p key={idx} className="mb-4 text-gray-700">{section.text}</p>;
                return null;
            })}
        </div>
    );
} 
