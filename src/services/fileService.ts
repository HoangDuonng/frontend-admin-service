export function getFileUrl(context: string, entityId: string, filename: string) {
  const url = `/api/files/${context}/${entityId}/${filename}`;
  return url;
}
