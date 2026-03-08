import { scoreAudienceMatch } from "./audience-match";
import { scoreConsistency } from "./consistency";
import { scoreEngagement } from "./engagement";
import { scoreTopicRelevance } from "./topic-relevance";
import { scoreViews } from "./views";

import { createServerClient } from "@/lib/supabase/server";
import { type Channel, type Comment, type Video } from "@/lib/supabase/types";

export interface ScoreBreakdown {
  topicRelevance: number;
  viewsScore: number;
  engagementScore: number;
  consistencyScore: number;
  audienceMatchScore: number;
  overallScore: number;
}

const WEIGHTS = {
  topicRelevance: 0.3,
  views: 0.25,
  engagement: 0.2,
  consistency: 0.15,
  audienceMatch: 0.1,
};

/**
 * Compute and store the full scoring breakdown for a channel.
 *
 * Requires that channel data (videos + comments) has already been ingested.
 */
export async function scoreChannel(
  channelId: string,
  keywords: string[]
): Promise<ScoreBreakdown> {
  const supabase = createServerClient();

  // Fetch channel
  const { data: channel } = await supabase
    .from("channels")
    .select("*")
    .eq("channel_id", channelId)
    .single();

  if (!channel) {
    throw new Error(`Channel not found: ${channelId}`);
  }

  // Fetch recent videos
  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .eq("channel_id", channelId)
    .order("published_at", { ascending: false })
    .limit(50);

  // Fetch comments
  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("channel_id", channelId);

  const typedChannel = channel as Channel;
  const typedVideos = (videos ?? []) as Video[];
  const typedComments = (comments ?? []) as Comment[];

  // Compute individual scores
  const topicRelevance = scoreTopicRelevance(typedVideos, keywords);
  const viewsScore = scoreViews(typedVideos, typedChannel.subscriber_count);
  const engagementScore = scoreEngagement(typedVideos);
  const consistencyScore = scoreConsistency(typedVideos);
  const audienceMatchScore = scoreAudienceMatch(typedComments, keywords);

  // Weighted overall
  const overallScore = Math.round(
    topicRelevance * WEIGHTS.topicRelevance +
      viewsScore * WEIGHTS.views +
      engagementScore * WEIGHTS.engagement +
      consistencyScore * WEIGHTS.consistency +
      audienceMatchScore * WEIGHTS.audienceMatch
  );

  const breakdown: ScoreBreakdown = {
    topicRelevance: Math.round(topicRelevance),
    viewsScore: Math.round(viewsScore),
    engagementScore: Math.round(engagementScore),
    consistencyScore: Math.round(consistencyScore),
    audienceMatchScore: Math.round(audienceMatchScore),
    overallScore,
  };

  // Upsert scores into database
  await supabase.from("channel_scores").upsert(
    {
      channel_id: channelId,
      topic_relevance: breakdown.topicRelevance,
      views_score: breakdown.viewsScore,
      engagement_score: breakdown.engagementScore,
      consistency_score: breakdown.consistencyScore,
      audience_match_score: breakdown.audienceMatchScore,
      overall_score: breakdown.overallScore,
      scoring_context: {
        keywords,
        videos_analyzed: typedVideos.length,
        comments_analyzed: typedComments.length,
      },
    },
    { onConflict: "channel_id" }
  );

  return breakdown;
}
