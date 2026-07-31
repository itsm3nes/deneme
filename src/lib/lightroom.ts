import "server-only";

import { XMP_COLORS, type XmpColor } from "./lightroom.client";

export { XMP_COLORS, type XmpColor };

export type XmpOptions = {
  rating: number;
  label: XmpColor | null;
  keyword: string;
  noteToCaption: boolean;
};

export const DEFAULT_XMP_OPTIONS: XmpOptions = {
  rating: 5,
  label: "Green",
  keyword: "Client Selects",
  noteToCaption: true,
};

function escapeXml(value: string): string {
  return (
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
      // XML 1.0 forbids most control characters outright.
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
  );
}

export function buildXmp(note: string | null, options: XmpOptions): string {
  const rating = Math.min(5, Math.max(0, Math.round(options.rating)));
  const keyword = options.keyword.trim();
  const caption = options.noteToCaption ? note?.trim() : null;

  const attrs = [`xmp:Rating="${rating}"`];
  if (options.label) attrs.push(`xmp:Label="${escapeXml(options.label)}"`);

  const blocks: string[] = [];

  if (caption) {
    blocks.push(
      `   <dc:description>
    <rdf:Alt>
     <rdf:li xml:lang="x-default">${escapeXml(caption)}</rdf:li>
    </rdf:Alt>
   </dc:description>`,
    );
  }

  if (keyword) {
    blocks.push(
      `   <dc:subject>
    <rdf:Bag>
     <rdf:li>${escapeXml(keyword)}</rdf:li>
    </rdf:Bag>
   </dc:subject>
   <lr:hierarchicalSubject>
    <rdf:Bag>
     <rdf:li>${escapeXml(keyword)}</rdf:li>
    </rdf:Bag>
   </lr:hierarchicalSubject>`,
    );
  }

  return `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Kadraj">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:xmp="http://ns.adobe.com/xap/1.0/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:lr="http://ns.adobe.com/lightroom/1.0/"
   ${attrs.join("\n   ")}>
${blocks.join("\n")}
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>
`;
}

export function parseXmpOptions(searchParams: URLSearchParams): XmpOptions {
  const rating = Number(searchParams.get("rating"));
  const label = searchParams.get("label");
  const keyword = searchParams.get("keyword");

  return {
    rating: Number.isFinite(rating) ? rating : DEFAULT_XMP_OPTIONS.rating,
    label: (XMP_COLORS as readonly string[]).includes(label ?? "")
      ? (label as XmpColor)
      : null,
    keyword: keyword ?? DEFAULT_XMP_OPTIONS.keyword,
    noteToCaption: searchParams.get("caption") !== "0",
  };
}

/** Lightroom Classic's Library Filter ▸ Text ▸ Filename ▸ "Contains Any" splits on spaces. */
export function buildFilenameList(baseNames: string[]): string {
  return [...new Set(baseNames)].join(" ") + "\n";
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function buildCsv(
  rows: { filename: string; note: string | null; selectedAt: string }[],
  headers: [string, string, string],
): string {
  const lines = [headers.map(csvCell).join(",")];
  for (const row of rows) {
    lines.push(
      [
        csvCell(row.filename),
        csvCell(row.note ?? ""),
        csvCell(row.selectedAt),
      ].join(","),
    );
  }
  // BOM keeps Excel from mangling UTF-8 (Turkish characters in particular).
  return "\uFEFF" + lines.join("\r\n") + "\r\n";
}

/** Sidecars must sit next to the RAW file under its exact basename, so collisions get suffixed. */
export function uniqueSidecarName(
  baseName: string,
  taken: Set<string>,
): string {
  const safe = baseName.replace(/[/\\:*?"<>|]/g, "_") || "photo";
  let name = `${safe}.xmp`;
  let n = 2;
  while (taken.has(name.toLowerCase())) {
    name = `${safe} (${n++}).xmp`;
  }
  taken.add(name.toLowerCase());
  return name;
}
