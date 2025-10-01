import { FooterLayout } from "../types/footer";

export async function fetchFooterLayout(language: string = 'vi'): Promise<FooterLayout | null> {
    try {
        const res = await fetch(`/api/footer?language=${language}`);
        const json = await res.json();
        if (json.success && json.data) {
            return json.data as FooterLayout;
        }
        return null;
    } catch (e) {
        return null;
    }
}

export async function updateFooterLayout(language: string, data: any) {
    const res = await fetch(`/api/footer?language=${language}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Cập nhật footer thất bại");
    return res.json();
} 
