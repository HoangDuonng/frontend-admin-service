import { HeaderLayout } from "../types/header";

export async function fetchHeaderLayout(language: string = 'vi'): Promise<HeaderLayout | null> {
    try {
        const res = await fetch(`/api/header?language=${language}`);
        const json = await res.json();
        if (json.success && json.data) {
            return json.data as HeaderLayout;
        }
        return null;
    } catch (e) {
        return null;
    }
}

export async function updateHeaderLayout(language: string, data: any) {
    const res = await fetch(`/api/header?language=${language}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Cập nhật header thất bại");
    return res.json();
} 
