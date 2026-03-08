import { type Comment } from "@/lib/supabase/types";

/**
 * Audience Match Score (10% weight)
 *
 * Keyword-based comment analysis as a proxy for audience fit.
 * Scans comment text for target audience keywords.
 *
 * This is the baseline version — upgraded by AI analysis (Gemini)
 * when available.
 *
 * Returns 0–100.
 */
export function scoreAudienceMatch(
  comments: Comment[],
  keywords: string[],
): number {
  if (comments.length === 0 || keywords.length === 0) return 0;

  const lowerKeywords = keywords.map((k) => k.toLowerCase());

  let matchingComments = 0;

  for (const comment of comments) {
    const text = comment.comment_text.toLowerCase();
    const hasMatch = lowerKeywords.some((keyword) => text.includes(keyword));
    if (hasMatch) matchingComments++;
  }

  const matchRatio = matchingComments / comments.length;

  // Scale: even a 10% comment match rate is meaningful
  if (matchRatio >= 0.3) return 100;
  if (matchRatio >= 0.2) return 80 + ((matchRatio - 0.2) / 0.1) * 20;
  if (matchRatio >= 0.1) return 55 + ((matchRatio - 0.1) / 0.1) * 25;
  if (matchRatio >= 0.05) return 30 + ((matchRatio - 0.05) / 0.05) * 25;
  return (matchRatio / 0.05) * 30;
}
