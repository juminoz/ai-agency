import { type Video } from "@/lib/supabase/types";

/**
 * Topic Relevance Score (30% weight)
 *
 * Measures how well a channel's recent content matches target keywords.
 * Checks video titles, descriptions, and tags against a keyword dictionary.
 *
 * Returns 0–100.
 */
export function scoreTopicRelevance(
  videos: Video[],
  keywords: string[],
): number {
  if (videos.length === 0 || keywords.length === 0) return 0;

  const lowerKeywords = keywords.map((k) => k.toLowerCase());

  let matchingVideos = 0;

  for (const video of videos) {
    const searchText = [
      video.title,
      video.description ?? "",
      ...(video.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();

    const hasMatch = lowerKeywords.some((keyword) =>
      searchText.includes(keyword),
    );

    if (hasMatch) matchingVideos++;
  }

  const matchRatio = matchingVideos / videos.length;

  // Scale: 0% match = 0, 50%+ match = 80–100, 100% match = 100
  if (matchRatio >= 1.0) return 100;
  if (matchRatio >= 0.8) return 85 + (matchRatio - 0.8) * 75;
  if (matchRatio >= 0.5) return 65 + (matchRatio - 0.5) * 66.67;
  if (matchRatio >= 0.2) return 30 + (matchRatio - 0.2) * 116.67;
  return matchRatio * 150;
}
