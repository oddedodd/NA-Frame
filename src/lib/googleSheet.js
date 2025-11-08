const SHEET_URL = sanitizeUrl(process.env.GOOGLE_SHEET_URL);

/**
 * Fetches the published Google Sheet and returns an array of row objects.
 * Assumes the first row contains column headers.
 *
 * @param {Object} [options]
 * @param {number|false} [options.revalidate=300] - Revalidation interval in seconds. Use `false` to disable caching.
 * @returns {Promise<Array<Record<string, string>>>}
 */
export async function fetchSheetRows({ revalidate = 300 } = {}) {
  if (!SHEET_URL) {
    throw new Error(
      "Missing environment variable GOOGLE_SHEET_URL. Add it to your .env.local file."
    );
  }

  const response = await fetch(SHEET_URL, {
    next: { revalidate },
    headers: { Accept: "text/csv" },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Google Sheet (${response.status} ${response.statusText})`
    );
  }

  const csv = await response.text();
  return parseCsv(csv);
}

function parseCsv(csv) {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const headers = splitCsvLine(lines[0]).map(sanitizeHeader);

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return headers.reduce((acc, header, index) => {
      acc[header] = values[index]?.trim?.() ?? "";
      return acc;
    }, {});
  });
}

function sanitizeHeader(header) {
  return header
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w]+/g, "_");
}

function splitCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i++; // skip escaped quote
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  if (current !== "" || line.endsWith(",")) {
    result.push(current);
  }

  return result;
}

function sanitizeUrl(value) {
  if (!value) return "";

  const trimmed = value.trim();
  const withoutQuotes = trimmed.replace(/^['"]/, "").replace(/['"];?$/, "");

  try {
    const url = new URL(withoutQuotes);
    return url.toString();
  } catch {
    throw new Error(
      `Invalid GOOGLE_SHEET_URL. Received "${value}". Make sure it's a fully qualified URL.`
    );
  }
}


