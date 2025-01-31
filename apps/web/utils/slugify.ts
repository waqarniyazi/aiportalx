export function slugify(text: unknown): string {
  if (Array.isArray(text)) {
    text = text[0]; // Only take the first element
  }

  if (typeof text !== "string") return "";

  return text
    .trim()
    .replace(/\s*\/\s*/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-.\(\)\+·]/g, "")
    .replace(/--+/g, "-");
}

// Improved deslugify function to correctly map back names
export function deslugify(text: unknown): string {
  if (typeof text !== "string") return "";

  return text.replace(/\b[a-z]/g, (char) => char.toUpperCase()); // Capitalize first letters
}
