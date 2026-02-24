
export function formatMediaUrl(url: string | null | undefined, r2PublicUrl: string | null | undefined, r2BucketName?: string, r2AccountId?: string): string {
  if (!url) return "";
  
  // If it's already a full URL, return it
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  
  // If it's a relative path that's NOT an upload (e.g. starting with /icons or /images), 
  // we might want to keep it local. But usually, user wants R2.
  // For this project, let's assume if it doesn't have a protocol, it's an R2 file.
  
  if (r2PublicUrl) {
    const base = r2PublicUrl.endsWith("/") ? r2PublicUrl.slice(0, -1) : r2PublicUrl;
    const path = url.startsWith("/") ? url.slice(1) : url;
    return `${base}/${path}`;
  }
  
  if (r2BucketName && r2AccountId) {
    const path = url.startsWith("/") ? url.slice(1) : url;
    return `https://${r2BucketName}.${r2AccountId}.r2.dev/${path}`;
  }
  
  return url;
}
