/**
 * Strips HTML tags from a string.
 * @param html - The HTML string to strip.
 * @returns The plain text string without HTML tags.
 */
export function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Cleans malformed HTML by fixing underscores in tag attributes and content.
 * @param html - The HTML string to clean.
 * @returns The cleaned HTML string.
 */
export function cleanHTML(html: string): string {
  return html
    // Fix underscores in tag names and attributes (e.g., <td_colspan="4"_bgcolor="#ffffcc" -> <td colspan="4" bgcolor="#ffffcc")
    .replace(/<([a-zA-Z]+(?:_[a-zA-Z]+)*)/g, (match) => {
      return '<' + match.slice(1).replace(/_/g, ' ');
    })
    // Fix underscores at the beginning of words in content (e.g., _introduction_to_c++ -> introduction_to_c++)
    .replace(/_([a-zA-Z])/g, '$1');
}