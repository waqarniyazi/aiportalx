export function slugify(text) {
  if (Array.isArray(text)) {
    text = text[0];
  }
  if (typeof text !== "string") return "";

  return text
    .trim()
    .replace(/·/g, "-") // Replace middle dot with hyphen
    .replace(/\s*\/\s*/g, "-") // Replace slashes with hyphen
    .replace(/\s+/g, "-") // Replace spaces with hyphen
    .replace(/[^A-Za-z0-9.\-]/g, "") // Keep letters, digits, periods, hyphens
    .replace(/-+/g, "-") // Merge consecutive hyphens
    .replace(/^-+|-+$/g, ""); // Strip leading/trailing hyphens
}

export function deslugify(text) {
  // We will no longer use deslugify to “rebuild” the original string.
  // (Its naive replacement of hyphen with space breaks names like “BIG-G 137B”.)
  if (typeof text !== "string") return "";
  return text;
}
