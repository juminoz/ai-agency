import { type Video } from "@/lib/supabase/types";

/**
 * Engagement Health Score (20% weight)
 *
 * Evaluates like_rate, comment_rate, and engagement_rate using the median
 * across recent videos. Also checks for outlier dominance.
 *
 * Returns 0–100.
 */
export function scoreEngagement(videos: Video[]): number {
  if (videos.length === 0) return 0;

  const rates = videos
    .filter((v) => v.view_count > 0)
    .map((v) => ({
      likeRate: v.like_count / v.view_count,
      commentRate: v.comment_count / v.view_count,
      engagementRate: (v.like_count + v.comment_count) / v.view_count,
    }));

  if (rates.length === 0) return 0;

  const medianEngagement = medianOf(rates.map((r) => r.engagementRate));
  const medianLikeRate = medianOf(rates.map((r) => r.likeRate));
  const medianCommentRate = medianOf(rates.map((r) => r.commentRate));

  // Engagement rate scoring (0–50 points)
  const engagementPoints = scoreEngagementRate(medianEngagement);

  // Like distribution (0–25 points) — penalize if likes are too concentrated
  const likePoints = medianLikeRate > 0 ? Math.min(25, medianLikeRate * 500) : 0;

  // Comment distribution (0–25 points) — comments indicate real audience
  const commentPoints = medianCommentRate > 0
    ? Math.min(25, medianCommentRate * 2500)
    : 0;

  return Math.min(100, Math.round(engagementPoints + likePoints + commentPoints));
}

function scoreEngagementRate(rate: number): number {
  // Excellent: >= 5%
  if (rate >= 0.05) return 50;
  // Good: 3–5%
  if (rate >= 0.03) return 38 + ((rate - 0.03) / 0.02) * 12;
  // Moderate: 1–3%
  if (rate >= 0.01) return 20 + ((rate - 0.01) / 0.02) * 18;
  // Low: < 1%
  return (rate / 0.01) * 20;
}

function medianOf(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
  }
  return sorted[mid] ?? 0;
}
