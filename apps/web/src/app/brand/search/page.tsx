import { CreatorSearch } from "@/components/creator-search";
import { getCreators } from "@/lib/data";

export default async function BrandSearchPage() {
  const creators = await getCreators();

  // Map DB row shape → the camelCase shape CreatorSearch expects
  const mapped = creators.map((c) => ({
    id: c.id,
    handle: c.handle,
    name: c.name,
    avatar: c.avatar ?? "",
    bio: c.bio ?? "",
    platform: c.platform,
    subscriberCount: c.subscriber_count,
    videoCount: c.video_count,
    categories: c.categories,
    nicheTags: c.niche_tags,
    availabilityStatus: c.availability_status,
    minimumDealSize: c.minimum_deal_size,
    brandPreferences: {
      open: c.brand_preferences_open,
      blocked: c.brand_preferences_blocked,
    },
    publicProfileUrl: c.public_profile_url ?? "",
    channelUrl: c.channel_url ?? "",
    score: {
      overall: c.score_overall,
      topicRelevance: c.score_topic_relevance,
      recentViews: c.score_recent_views,
      engagementHealth: c.score_engagement_health,
      authenticity: c.score_authenticity,
      activityConsistency: c.score_activity_consistency,
      commentAudienceMatch: c.score_comment_audience_match,
    },
    nicheRanking: {
      percentile: c.niche_percentile,
      category: c.niche_category ?? "",
      tier: c.niche_tier ?? "",
    },
    performanceTrend: {
      viewsTrend: c.views_trend ?? "",
      engagementTrend: c.engagement_trend ?? "",
      narrative: c.trend_narrative ?? "",
    },
    audienceInterests: c.audience_interests,
    authenticity: {
      score: c.authenticity_score,
      fakeFollowerRisk: c.fake_follower_risk,
      viewSpikeDetected: c.view_spike_detected,
      commentQuality: c.comment_quality,
      likeToViewNormality: c.like_to_view_normality,
    },
    recentVideos: [] as { id: string; title: string; publishedAt: string; views: number; likes: number; comments: number; engagementRate: number }[],
    trackRecord: {
      completedCampaigns: c.completed_campaigns,
      deliveryRate: c.delivery_rate,
      avgPerformanceVsProjection: c.avg_performance_vs_projection ?? "",
      avgRating: c.avg_rating,
    },
    dealHistory: c.deal_history,
  }));

  return <CreatorSearch creators={mapped} />;
}
