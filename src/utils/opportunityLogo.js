/**
 * True when the value is safe to use as an <img src> (not a plain emoji or label).
 */
export function isOpportunityLogoImage(value) {
  if (value == null || typeof value !== "string") return false;
  const v = value.trim();
  if (!v) return false;
  return (
    v.startsWith("data:image/") ||
    v.startsWith("blob:") ||
    /^https?:\/\//i.test(v)
  );
}
