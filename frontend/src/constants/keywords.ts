/**
 * Keyword Constants from Dataset
 * Extracted from AI Classifier Dataset
 */

// ILLEGAL Keywords
export const ILLEGAL_KEYWORDS = [
  "SLOT",
  "bandar slot terpercaya",
  "bonus new member slot",
  "casino online",
  "microgaming",
  "pg soft",
  "poker online",
  "porno",
  "pragmatic play slot",
  "situs slot gacor",
  "slot88",
  "slot deposit 10rb",
  "slot deposit pulsa",
  "slot gacor maxwin",
] as const;

// LEGAL Keywords
export const LEGAL_KEYWORDS = [
  "aplikasi belajar bahasa",
  "berita teknologi",
  "jasa fotografi",
  "jual beli mobil bekas",
  "kursus online terpercaya",
  "startup indonesia",
  "toko buku online",
  "unesa manajemen informatika",
  "unesa teknik informatika",
  "universitas terbaik indonesia",
] as const;

// All Keywords Combined
export const ALL_KEYWORDS = [
  ...ILLEGAL_KEYWORDS,
  ...LEGAL_KEYWORDS,
] as const;

// Keyword Categories
export const KEYWORD_CATEGORIES = {
  ILLEGAL: ILLEGAL_KEYWORDS,
  LEGAL: LEGAL_KEYWORDS,
} as const;

// Helper function to check if keyword is illegal
export function isIllegalKeyword(keyword: string): boolean {
  return ILLEGAL_KEYWORDS.some(
    (illegal) => keyword.toLowerCase().includes(illegal.toLowerCase())
  );
}

// Helper function to check if keyword is legal
export function isLegalKeyword(keyword: string): boolean {
  return LEGAL_KEYWORDS.some(
    (legal) => keyword.toLowerCase().includes(legal.toLowerCase())
  );
}

// Get keyword category
export function getKeywordCategory(keyword: string): "ILLEGAL" | "LEGAL" | "UNKNOWN" {
  if (isIllegalKeyword(keyword)) return "ILLEGAL";
  if (isLegalKeyword(keyword)) return "LEGAL";
  return "UNKNOWN";
}
