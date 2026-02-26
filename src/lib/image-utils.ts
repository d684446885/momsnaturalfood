/**
 * Normalizes image URL for Next.js Image component
 * Ensures relative paths start with "/" and absolute URLs are unchanged
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return "/placeholder.png";
  
  // If it's already an absolute URL (http:// or https://), return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  
  // If it's a relative path without leading slash, add it
  if (!url.startsWith("/")) {
    return `/${url}`;
  }
  
  return url;
}

/**
 * Normalizes an array of image URLs
 */
export function normalizeImageUrls(urls: string[] | null | undefined): string[] {
  if (!urls || urls.length === 0) return ["/placeholder.png"];
  return urls.map(normalizeImageUrl);
}
