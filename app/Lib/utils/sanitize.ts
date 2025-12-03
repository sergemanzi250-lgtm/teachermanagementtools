/**
 * Strips HTML tags from a string.
 * @param html - The HTML string to strip.
 * @returns The plain text string without HTML tags.
 */
export function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}