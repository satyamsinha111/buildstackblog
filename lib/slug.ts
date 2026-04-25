export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface ExtractedHeading {
  level: 2 | 3;
  text: string;
  id: string;
}

/**
 * Extract H2/H3 headings from a markdown source string.
 * Mirrors the IDs that rehype-slug will generate so anchor links match.
 */
export function extractHeadings(markdown: string): ExtractedHeading[] {
  const lines = markdown.split("\n");
  const headings: ExtractedHeading[] = [];
  let inCodeFence = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const level = match[1].length === 2 ? 2 : 3;
    const text = match[2].replace(/[`*_]/g, "");
    headings.push({ level: level as 2 | 3, text, id: slugify(text) });
  }

  return headings;
}
