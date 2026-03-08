import { type Video } from "@/lib/supabase/types";

/**
 * Recent Views Score (25% weight)
 *
 * Evaluates whether recent videos are getting meaningful views.
 * Uses median views of recent videos and views-per-subscriber ratio.
 *
 * Thresholds from scoring.md:
 * - strong: median recent views >= 30% of subscribers
 * - okay: 10%–30%
 * - weak: <10%
 *
 * Returns 0–100.
 */
export function scoreViews(
  videos: Video[],
  subscriberCount: number,
): number {
  if (videos.length === 0) return 0;

  const viewCounts = videos
    .map((v) => v.view_count)
    .sort((a, b) => a - b);

  const medianViews = median(viewCounts);

  // Score based on absolute views (0–50 points)
  const absoluteScore = scoreAbsoluteViews(medianViews);

  // Score based on views-per-subscriber ratio (0–50 points)
  const ratioScore =
    subscriberCount > 0
      ? scoreViewsPerSub(medianViews / subscriberCount)
      : 25; // neutral if no sub count

  return Math.min(100, absoluteScore + ratioScore);
}

function scoreAbsoluteViews(medianViews: number): number {
  if (medianViews >= 500_000) return 50;
  if (medianViews >= 100_000) return 42;
  if (medianViews >= 50_000) return 36;
  if (medianViews >= 10_000) return 28;
  if (medianViews >= 5_000) return 22;
  if (medianViews >= 1_000) return 15;
  if (medianViews >= 500) return 10;
  return Math.max(0, (medianViews / 500) * 10);
}

function scoreViewsPerSub(ratio: number): number {
  // strong: >= 30% of subs
  if (ratio >= 0.3) return 50;
  // okay: 10–30%
  if (ratio >= 0.1) return 25 + ((ratio - 0.1) / 0.2) * 25;
  // weak: < 10%
  return (ratio / 0.1) * 25;
}

function median(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
  }
  return sorted[mid] ?? 0;
}
