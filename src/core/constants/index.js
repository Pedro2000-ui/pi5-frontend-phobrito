/**
 * Base URL for API requests. It can be set via the VITE_API_BASE_URL
 * environment variable, or defaults to 'http://localhost:3000/api'
 * if not provided.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
