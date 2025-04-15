/**
 * Converts a yyyy-mm-dd string to our compact 24-bit representation
 */
export function dateToCompact(dateStr: string): number {
  if (!dateStr) return 0;
  const [year, month, day] = parseDateString(dateStr);
  return encodeDate(year, month, day);
}

/**
 * Converts our compact 24-bit representation to a yyyy-mm-dd string
 */
export function compactToDate(compact: number): string {
  if (compact === 0) return '';
  const [year, month, day] = decodeDate(compact);
  return formatDateString(year, month, day);
}

/**
 * Parse a yyyy-mm-dd string into year, month, day components
 */
function parseDateString(dateStr: string): [number, number, number] {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) {
    throw new Error('Date must be in yyyy-mm-dd format');
  }

  const [, yearStr, monthStr, dayStr] = match;
  const year = Number.parseInt(yearStr, 10);
  const month = Number.parseInt(monthStr, 10);
  const day = Number.parseInt(dayStr, 10);

  return [year, month, day];
}

/**
 * Format components into yyyy-mm-dd string
 */
function formatDateString(year: number, month: number, day: number): string {
  if (year === 0 && month === 0 && day === 0) {
    return '';
  }

  const yyyy = year.toString().padStart(4, '0');
  const mm = month.toString().padStart(2, '0');
  const dd = day.toString().padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Encodes date into a compact 24-bit number:
 * - 15 bits for year (1000-9999)
 * - 4 bits for month (1-12)
 * - 5 bits for day (0-31)
 */
function encodeDate(year: number, month: number, day: number): number {
  // Validate inputs for binary format
  if (year < 1000 || year > 9999) {
    throw new Error(`Year must be between 1000 and 9999, got ${year}`);
  }
  if (month < 1 || month > 12) {
    throw new Error(`Month must be between 1 and 12, got ${month}`);
  }
  if (day < 1 || day > 31) {
    throw new Error(`Day must be between 1 and 31, got ${day}`);
  }

  // Encode as bits
  return (year << 9) | ((month & 0xF) << 5) | (day & 0x1F);
}

/**
 * Decodes a 24-bit number into separate date components
 */
function decodeDate(bits: number): [number, number, number] {
  return [
    /* year */ bits >>> 9,
    /* month */ (bits >>> 5) & 0xF,
    /* day */ bits & 0x1F
  ];
}
