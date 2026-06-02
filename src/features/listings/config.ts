/**
 * Vendor listing API paths (relative to VITE_API_BASE_URL).
 *
 * Suggested backend contract — implement on the API service:
 *
 * | Method | Path | Purpose |
 * |--------|------|---------|
 * | GET | vendor/listings | Paginated list for the authenticated vendor (?page, pageSize, status, search, categoryType) |
 * | GET | vendor/listings/{id} | Single listing detail (owner only) |
 * | POST | vendor/listings | Create listing (JSON or multipart when images included) |
 * | PUT | vendor/listings/{id} | Update listing fields |
 * | DELETE | vendor/listings/{id} | Soft-delete / archive |
 * | POST | vendor/listings/{id}/images | Upload additional images (multipart) |
 * | DELETE | vendor/listings/{id}/images/{imageId} | Remove an image |
 * | POST | vendor/listings/{id}/publish | Submit draft for admin review |
 * | GET | listings/categories | Public catalog of category metadata (optional) |
 */
const trimSlash = (path: string) => path.replace(/^\/+|\/+$/g, '');

export const vendorListingPaths = {
  listings: trimSlash(import.meta.env.VITE_VENDOR_LISTINGS_PATH ?? 'vendor/listings'),
  categories: trimSlash(import.meta.env.VITE_LISTINGS_CATEGORIES_PATH ?? 'listings/categories'),
  listing: (id: string) => `${vendorListingPaths.listings}/${id}`,
  listingImages: (id: string) => `${vendorListingPaths.listings}/${id}/images`,
  listingPublish: (id: string) => `${vendorListingPaths.listings}/${id}/publish`,
} as const;

export const VENDOR_LISTINGS_QUERY_KEY = ['vendor', 'listings'] as const;
