import { UploadFileParams, UploadFileResponse } from "@/types/post";

export function getFileUrl(context: string, entityId: string, filename: string) {
  const url = `/api/files/${context}/${entityId}/${filename}`;
  return url;
}

export async function uploadFile({ file, context, entityId, type, position }: UploadFileParams): Promise<UploadFileResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('context', context);
  formData.append('entityId', entityId);
  formData.append('type', type);
  formData.append('position', position);
  // Gọi qua NextJS API proxy
  const res = await fetch('/api/files/upload', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return await res.json();
}
