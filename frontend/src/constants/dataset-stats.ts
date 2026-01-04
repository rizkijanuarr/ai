/**
 * Dataset Statistics
 * Based on keyword analysis from dataset
 */

import { ILLEGAL_KEYWORDS, LEGAL_KEYWORDS } from "./keywords";

export const DATASET_STATS = {
  // Total unique keywords
  TOTAL_KEYWORDS: 24,
  ILLEGAL_COUNT: 14,
  LEGAL_COUNT: 10,

  // Keyword distribution
  DISTRIBUTION: {
    ILLEGAL: {
      count: 14,
      percentage: 58.33,
      keywords: ILLEGAL_KEYWORDS,
    },
    LEGAL: {
      count: 10,
      percentage: 41.67,
      keywords: LEGAL_KEYWORDS,
    },
  },

  // Top categories
  TOP_ILLEGAL_CATEGORIES: [
    { category: "Gambling/Slot", count: 9 },
    { category: "Adult Content", count: 1 },
    { category: "Online Casino", count: 4 },
  ],

  TOP_LEGAL_CATEGORIES: [
    { category: "Education", count: 4 },
    { category: "Technology", count: 2 },
    { category: "E-commerce", count: 2 },
    { category: "Services", count: 2 },
  ],
} as const;

// Get dataset summary
export function getDatasetSummary() {
  return {
    total: DATASET_STATS.TOTAL_KEYWORDS,
    illegal: DATASET_STATS.ILLEGAL_COUNT,
    legal: DATASET_STATS.LEGAL_COUNT,
    illegalPercentage: DATASET_STATS.DISTRIBUTION.ILLEGAL.percentage,
    legalPercentage: DATASET_STATS.DISTRIBUTION.LEGAL.percentage,
  };
}
