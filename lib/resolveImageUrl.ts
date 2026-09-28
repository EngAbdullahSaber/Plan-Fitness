import { baseUrl } from "@/app/services/app.config";

// Stored image URLs may be relative upload paths; prefix them with the API base URL
export const resolveImageUrl = (url?: string | null): string | null => {
  if (!url || url === baseUrl) return null;
  if (/^(https?:|data:|blob:)/.test(url)) return url;
  return baseUrl + url.replace(/^\/+/, "");
};
