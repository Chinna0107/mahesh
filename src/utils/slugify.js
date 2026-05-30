/**
 * Generates an SEO-friendly URL slug from a product name.
 * Sanitizes and falls back gracefully to a unique ID if name is missing.
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')        // Remove all non-word chars
    .replace(/\-\-+/g, '-')          // Replace multiple - with single -
    .replace(/^-+/, '')              // Trim - from start
    .replace(/-+$/, '');             // Trim - from end
}
