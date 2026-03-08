import { type Comment, type Video } from "@/lib/supabase/types";

export interface AuthenticityResult {
  score: number;
  riskLevel: "low" | "medium" | "high";
  viewConsistency: number;
  commentQuality: number;
  likeRatioNormality: number;
  details: {
    spikeCount: number;
    medianViews: number;
    avgLikeRatio: number;
    spamCommentRatio: number;
  };
}

/**
 * Authenticity / Bot Detection
 *
 * From scoring.md section 6:
 * - View spike detection: flag videos > 5× channel median views
 * - Like-to-view anomaly: flag if likeCount/viewCount > 10%
 * - Comment quality: classify genuine vs spam (basic heuristic, AI-upgraded later)
 * - Follower growth consistency: sub count vs view trends
 *
 * authenticity_score =
 *   25% view consistency (inverse of spike ratio)
 * + 25% comment quality (% classified as genuine)
 * + 25% like-to-view ratio normality
 * + 25% follower-growth consistency
 *
 * Returns 0–100 + risk level.
 */
export function analyzeAuthenticity(
  videos: Video[],
  comments: Comment[],
  subscriberCount: number,
): AuthenticityResult {
  if (videos.length === 0) {
    return {
      score: 0,
      riskLevel: "high",
      viewConsistency: 0,
      commentQuality: 0,
      likeRatioNormality: 0,
      details: {
        spikeCount: 0,
        medianViews: 0,
        avgLikeRatio: 0,
        spamCommentRatio: 0,
      },
    };
  }

  const viewConsistencyResult = scoreViewConsistency(videos);
  const commentQualityResult = scoreCommentQuality(comments);
  const likeRatioResult = scoreLikeRatioNormality(videos);
  const growthResult = scoreGrowthConsistency(videos, subscriberCount);

  const score = Math.round(
    viewConsistencyResult.score * 0.25 +
      commentQualityResult.score * 0.25 +
      likeRatioResult.score * 0.25 +
      growthResult * 0.25,
  );

  let riskLevel: "low" | "medium" | "high" = "low";
  if (score < 50) riskLevel = "high";
  else if (score < 75) riskLevel = "medium";

  return {
    score,
    riskLevel,
    viewConsistency: Math.round(viewConsistencyResult.score),
    commentQuality: Math.round(commentQualityResult.score),
    likeRatioNormality: Math.round(likeRatioResult.score),
    details: {
      spikeCount: viewConsistencyResult.spikeCount,
      medianViews: viewConsistencyResult.medianViews,
      avgLikeRatio: likeRatioResult.avgRatio,
      spamCommentRatio: commentQualityResult.spamRatio,
    },
  };
}

function scoreViewConsistency(videos: Video[]): {
  score: number;
  spikeCount: number;
  medianViews: number;
} {
  const views = videos.map((v) => v.view_count).sort((a, b) => a - b);
  const mid = Math.floor(views.length / 2);
  const medianViews =
    views.length % 2 === 0
      ? ((views[mid - 1]! + views[mid]!) / 2)
      : views[mid]!;

  if (medianViews === 0) {
    return { score: 50, spikeCount: 0, medianViews: 0 };
  }

  // Flag videos > 5× median
  const spikeCount = videos.filter(
    (v) => v.view_count > medianViews * 5,
  ).length;
  const spikeRatio = spikeCount / videos.length;

  // 0 spikes = 100, >30% spikes = 20
  const score = Math.max(20, 100 - spikeRatio * 250);

  return { score, spikeCount, medianViews };
}

function scoreCommentQuality(comments: Comment[]): {
  score: number;
  spamRatio: number;
} {
  if (comments.length === 0) return { score: 50, spamRatio: 0 };

  // Basic heuristic spam detection (upgraded by Gemini later)
  const spamPatterns = [
    /^.{1,5}$/, // Very short comments (1–5 chars)
    /^[^\w\s]*$/, // Only emojis/symbols
    /sub\s*(for|4)\s*sub/i, // Sub4sub
    /check\s*out\s*my/i, // Self-promotion
    /follow\s*me/i,
    /(.)\1{4,}/, // Repeated characters (e.g., "aaaaaaa")
    /first[!.]*$/i, // "First!" comments
  ];

  let spamCount = 0;
  for (const comment of comments) {
    const text = comment.comment_text.trim();
    const isSpam = spamPatterns.some((pattern) => pattern.test(text));
    if (isSpam) spamCount++;
  }

  const spamRatio = spamCount / comments.length;
  const genuineRatio = 1 - spamRatio;

  // 100% genuine = 100, 0% genuine = 0
  const score = genuineRatio * 100;

  return { score, spamRatio };
}

function scoreLikeRatioNormality(videos: Video[]): {
  score: number;
  avgRatio: number;
} {
  const ratios = videos
    .filter((v) => v.view_count > 0)
    .map((v) => v.like_count / v.view_count);

  if (ratios.length === 0) return { score: 50, avgRatio: 0 };

  const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;

  // Normal like ratio: 2–6%. Suspicious if > 10%
  if (avgRatio >= 0.02 && avgRatio <= 0.06) return { score: 100, avgRatio };
  if (avgRatio < 0.02) {
    // Low engagement — not necessarily fake, just low
    return { score: 60, avgRatio };
  }
  if (avgRatio <= 0.1) {
    // Slightly high — could be genuine niche content
    return { score: 75, avgRatio };
  }
  // > 10% — suspicious
  const penalty = Math.min(80, (avgRatio - 0.1) * 500);
  return { score: Math.max(10, 80 - penalty), avgRatio };
}

function scoreGrowthConsistency(
  videos: Video[],
  subscriberCount: number,
): number {
  if (videos.length === 0 || subscriberCount === 0) return 50;

  // Compare total recent views vs subscriber count
  // A healthy channel has total recent views roughly proportional to subs
  const totalRecentViews = videos.reduce((sum, v) => sum + v.view_count, 0);
  const avgViewsPerVideo = totalRecentViews / videos.length;
  const viewSubRatio = avgViewsPerVideo / subscriberCount;

  // Healthy range: 5–50% of subs per video
  if (viewSubRatio >= 0.05 && viewSubRatio <= 0.5) return 100;
  if (viewSubRatio >= 0.01 && viewSubRatio < 0.05) return 70;
  if (viewSubRatio > 0.5 && viewSubRatio <= 1.0) return 70;

  // Very low views relative to subs = possible dead/bought followers
  if (viewSubRatio < 0.01) return 30;

  // Very high views relative to subs = likely viral / external traffic
  return 60;
}
