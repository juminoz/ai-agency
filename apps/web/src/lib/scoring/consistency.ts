import { type Video } from "@/lib/supabase/types";

/**
 * Activity & Consistency Score (15% weight)
 *
 * Evaluates:
 * - Upload frequency (40%)
 * - Recency of last upload (30%)
 * - View count stability across recent videos (30%)
 *
 * Returns 0–100.
 */
export function scoreConsistency(videos: Video[]): number {
  if (videos.length === 0) return 0;

  const sorted = [...videos]
    .filter((v) => v.published_at)
    .sort(
      (a, b) =>
        new Date(b.published_at!).getTime() -
        new Date(a.published_at!).getTime(),
    );

  if (sorted.length === 0) return 0;

  const frequencyScore = scoreFrequency(sorted) * 0.4;
  const recencyScore = scoreRecency(sorted[0]!) * 0.3;
  const stabilityScore = scoreViewStability(sorted) * 0.3;

  return Math.round(frequencyScore + recencyScore + stabilityScore);
}

/**
 * Upload frequency: average days between uploads.
 * <= 3 days = 100, <= 7 = 80, <= 14 = 60, <= 30 = 40, > 30 = 20
 */
function scoreFrequency(sortedVideos: Video[]): number {
  if (sortedVideos.length < 2) return 50;

  const dates = sortedVideos.map((v) => new Date(v.published_at!).getTime());
  const gaps: number[] = [];

  for (let i = 0; i < dates.length - 1; i++) {
    const daysBetween = ((dates[i]! - dates[i + 1]!) / (1000 * 60 * 60 * 24));
    gaps.push(daysBetween);
  }

  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;

  if (avgGap <= 3) return 100;
  if (avgGap <= 7) return 80;
  if (avgGap <= 14) return 60;
  if (avgGap <= 30) return 40;
  return 20;
}

/**
 * Recency: how many days since the last upload.
 * <= 7 days = 100, <= 14 = 80, <= 30 = 60, <= 60 = 30, > 60 = 10
 */
function scoreRecency(latestVideo: Video): number {
  const daysSince =
    (Date.now() - new Date(latestVideo.published_at!).getTime()) /
    (1000 * 60 * 60 * 24);

  if (daysSince <= 7) return 100;
  if (daysSince <= 14) return 80;
  if (daysSince <= 30) return 60;
  if (daysSince <= 60) return 30;
  return 10;
}

/**
 * View stability: coefficient of variation of recent view counts.
 * Lower CV = more consistent = higher score.
 */
function scoreViewStability(videos: Video[]): number {
  const views = videos.map((v) => v.view_count);
  if (views.length < 2) return 50;

  const mean = views.reduce((a, b) => a + b, 0) / views.length;
  if (mean === 0) return 0;

  const variance =
    views.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / views.length;
  const stdDev = Math.sqrt(variance);
  const cv = stdDev / mean; // coefficient of variation

  // CV 0 = perfect consistency (100), CV >= 2 = very inconsistent (10)
  if (cv <= 0.3) return 100;
  if (cv <= 0.5) return 80;
  if (cv <= 0.8) return 60;
  if (cv <= 1.2) return 40;
  if (cv <= 2.0) return 20;
  return 10;
}
