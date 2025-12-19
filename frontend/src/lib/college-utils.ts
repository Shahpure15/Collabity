/**
 * Extract college slug from subdomain
 * Examples:
 *   mitaoe.collabity.tech → mitaoe
 *   localhost:5173 → null (use manual override)
 *   collabity.tech → null (no subdomain)
 */
export function extractCollegeSlug(): string | null {
  const hostname = window.location.hostname;

  // Handle localhost - return null for manual override
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return null;
  }

  // Split hostname into parts
  const parts = hostname.split(".");

  // Need at least 3 parts for subdomain (e.g., mitaoe.collabity.tech)
  if (parts.length < 3) {
    return null;
  }

  // First part is the subdomain
  const subdomain = parts[0];

  // Validate subdomain format (alphanumeric and hyphens only)
  if (!/^[a-z0-9-]+$/i.test(subdomain)) {
    return null;
  }

  return subdomain;
}

/**
 * Get college slug with localStorage fallback for localhost
 */
export function getCollegeSlug(): string | null {
  const STORAGE_KEY = "collabity_college_override";

  // Try to extract from subdomain first
  const extractedSlug = extractCollegeSlug();
  
  if (extractedSlug) {
    // Store in localStorage as backup
    localStorage.setItem(STORAGE_KEY, extractedSlug);
    return extractedSlug;
  }

  // Fallback to localStorage (for localhost development)
  const storedSlug = localStorage.getItem(STORAGE_KEY);
  
  return storedSlug;
}

/**
 * Manually set college slug (for localhost development)
 */
export function setCollegeSlugOverride(slug: string): void {
  const STORAGE_KEY = "collabity_college_override";
  localStorage.setItem(STORAGE_KEY, slug);
  // Force reload to apply new college
  window.location.reload();
}

/**
 * Clear college slug override
 */
export function clearCollegeSlugOverride(): void {
  const STORAGE_KEY = "collabity_college_override";
  localStorage.removeItem(STORAGE_KEY);
}
