const FALLBACK_API_BASE_URL = "http://localhost:5000/api";

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  FALLBACK_API_BASE_URL;
