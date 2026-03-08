import { createServerClient } from "@/lib/supabase/server";
import { type Channel, type ChannelScore } from "@/lib/supabase/types";

export interface MatchQuery {
  keywords: string[];
  minSubscribers?: number;
  maxSubscribers?: number;
  minScore?: number;
  sortBy?:
    | "overall_score"
    | "views_score"
    | "engagement_score"
    | "subscriber_count";
  limit?: number;
}

export interface MatchResult {
  channel: Channel;
  scores: ChannelScore;
  matchReason: string;
}

/**
 * Match channels against a brand intent query.
 * Returns ranked channels filtered by criteria.
 */
export async function matchChannels(query: MatchQuery): Promise<MatchResult[]> {
  const {
    keywords,
    minSubscribers = 0,
    maxSubscribers,
    minScore = 0,
    sortBy = "overall_score",
    limit = 20,
  } = query;

  const supabase = createServerClient();

  // Build query for scored channels
  const dbQuery = supabase
    .from("channel_scores")
    .select("*")
    .gte("overall_score", minScore)
    .order(sortBy === "subscriber_count" ? "overall_score" : sortBy, {
      ascending: false,
    })
    .limit(limit * 2); // Fetch extra to filter

  const { data: scores, error: scoresError } = await dbQuery;

  if (scoresError || !scores || scores.length === 0) {
    return [];
  }

  // Fetch associated channels
  const channelIds = scores.map(
    (s: Record<string, unknown>) => s.channel_id as string
  );

  let channelQuery = supabase
    .from("channels")
    .select("*")
    .in("channel_id", channelIds)
    .gte("subscriber_count", minSubscribers);

  if (maxSubscribers) {
    channelQuery = channelQuery.lte("subscriber_count", maxSubscribers);
  }

  if (sortBy === "subscriber_count") {
    channelQuery = channelQuery.order("subscriber_count", {
      ascending: false,
    });
  }

  const { data: channels } = await channelQuery;

  if (!channels || channels.length === 0) return [];

  const channelMap = new Map(
    (channels as Channel[]).map((c) => [c.channel_id, c])
  );

  // Combine and filter by keywords
  const results: MatchResult[] = [];
  const keywordLower = keywords.map((k) => k.toLowerCase());

  for (const score of scores as ChannelScore[]) {
    const channel = channelMap.get(score.channel_id);
    if (!channel) continue;

    // Filter by keywords if provided
    if (keywordLower.length > 0) {
      const searchableText = [
        channel.title,
        channel.description,
        channel.custom_url,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const hasKeywordMatch = keywordLower.some(
        (kw) => kw.length >= 2 && searchableText.includes(kw)
      );

      if (!hasKeywordMatch) continue;
    }

    // Generate match reason
    const reasons: string[] = [];
    if (score.topic_relevance >= 70) reasons.push("strong topic alignment");
    if (score.engagement_score >= 70) reasons.push("high engagement");
    if (score.views_score >= 70) reasons.push("strong view performance");
    if (score.consistency_score >= 70) reasons.push("consistent uploads");
    if (score.audience_match_score >= 50)
      reasons.push("audience keyword match");

    results.push({
      channel,
      scores: score,
      matchReason:
        reasons.length > 0
          ? reasons.join(", ")
          : `Overall score: ${score.overall_score}`,
    });

    if (results.length >= limit) break;
  }

  return results;
}
