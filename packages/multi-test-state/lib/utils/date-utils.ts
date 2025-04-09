/**
 * Encodes date into a compact 24-bit number:
 * - 15 bits for year (0-16383)
 * - 4 bits for month (0-15)
 * - 5 bits for day (0-31)
 */
export function encodeDate(year: number, month: number, day: number): number {
  // Validate inputs
  if (year < 0 || year > 16383) {
    throw new Error(`Year must be between 0 and 16383, got ${year}`);
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
export function decodeDate(bits: number): { year: number; month: number; day: number } {
  return {
    year: bits >>> 9,
    month: (bits >>> 5) & 0xF,
    day: bits & 0x1F
  };
}

/**
 * Converts a JavaScript Date to our compact 24-bit representation
 */
export function dateToCompact(date: Date): number {
  return encodeDate(
    date.getFullYear(),
    date.getMonth() + 1, // JS months are 0-based
    date.getDate()
  );
}

/**
 * Converts our compact 24-bit representation to a JavaScript Date
 */
export function compactToDate(compact: number): Date {
  const { year, month, day } = decodeDate(compact);
  return new Date(year, month - 1, day); // JS months are 0-based
}

/**
 * Converts a timestamp to our compact date representation
 */
export function timestampToCompact(timestamp: number): number {
  const date = new Date(timestamp);
  return dateToCompact(date);
}

/**
 * Converts our compact date representation to a timestamp
 */
export function compactToTimestamp(compact: number): number {
  return compactToDate(compact).getTime();
} 