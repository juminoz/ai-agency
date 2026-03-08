/**
 * Data access layer for BrandBuddy.
 *
 * Tries Supabase first; falls back to local JSON mock data.
 * This lets the app work in both modes:
 *   - With Supabase tables populated (production / post-migration)
 *   - Without tables (dev / pre-migration)
 */

import { createClient } from "@supabase/supabase-js";

import type {
  Brand,
  Brief,
  CreatorProfile,
  CreatorVideo,
  Deal,
  DealMessage,
  Notification,
} from "@/lib/supabase/types";

// ── Lazy Supabase client (service-role, server-side only) ─────────────────
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

// ── Mock data imports (static JSON, always available) ─────────────────────
import mockBrandsJson from "@/data/mock/brands.json";
import mockCreatorsJson from "@/data/mock/creators.json";
import mockDealsJson from "@/data/mock/deals.json";
import mockNotificationsJson from "@/data/mock/notifications.json";

// ── Transform mock JSON → DB row shapes ───────────────────────────────────

function mockCreatorToRow(c: (typeof mockCreatorsJson)[number]): CreatorProfile {
  return {
    id: c.id,
    user_id: null,
    channel_id: null,
    handle: c.handle,
    name: c.name,
    avatar: c.avatar,
    bio: c.bio,
    platform: c.platform as "youtube" | "twitch",
    subscriber_count: c.subscriberCount,
    video_count: c.videoCount,
    categories: c.categories,
    niche_tags: c.nicheTags,
    availability_status: c.availabilityStatus as "open" | "limited" | "closed",
    minimum_deal_size: c.minimumDealSize,
    brand_preferences_open: c.brandPreferences.open,
    brand_preferences_blocked: c.brandPreferences.blocked,
    public_profile_url: c.publicProfileUrl,
    channel_url: c.channelUrl,
    score_overall: c.score.overall,
    score_topic_relevance: c.score.topicRelevance,
    score_recent_views: c.score.recentViews,
    score_engagement_health: c.score.engagementHealth,
    score_authenticity: c.score.authenticity,
    score_activity_consistency: c.score.activityConsistency,
    score_comment_audience_match: c.score.commentAudienceMatch,
    niche_percentile: c.nicheRanking.percentile,
    niche_category: c.nicheRanking.category,
    niche_tier: c.nicheRanking.tier,
    views_trend: c.performanceTrend.viewsTrend,
    engagement_trend: c.performanceTrend.engagementTrend,
    trend_narrative: c.performanceTrend.narrative,
    authenticity_score: c.authenticity.score,
    fake_follower_risk: c.authenticity.fakeFollowerRisk,
    view_spike_detected: c.authenticity.viewSpikeDetected,
    comment_quality: c.authenticity.commentQuality,
    like_to_view_normality: c.authenticity.likeToViewNormality,
    audience_interests: c.audienceInterests,
    completed_campaigns: c.trackRecord.completedCampaigns,
    delivery_rate: c.trackRecord.deliveryRate,
    avg_performance_vs_projection: c.trackRecord.avgPerformanceVsProjection,
    avg_rating: c.trackRecord.avgRating,
    deal_history: c.dealHistory,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function mockCreatorVideos(c: (typeof mockCreatorsJson)[number]): CreatorVideo[] {
  return c.recentVideos.map((v) => ({
    id: v.id,
    creator_id: c.id,
    video_id: v.id,
    title: v.title,
    published_at: v.publishedAt,
    views: v.views,
    likes: v.likes,
    comments: v.comments,
    engagement_rate: v.engagementRate,
    created_at: new Date().toISOString(),
  }));
}

type MockBrand = (typeof mockBrandsJson)[number];

function mockBrandToRow(b: MockBrand): Brand {
  return {
    id: b.id,
    user_id: null,
    name: b.name,
    logo: b.logo,
    category: b.category,
    description: b.description,
    target_age_range: b.targetAudience.ageRange,
    target_gender: b.targetAudience.gender,
    target_interests: b.targetAudience.interests,
    target_locations: b.targetAudience.locations,
    completed_deals: b.completedDeals,
    reliability_score: b.reliabilityScore,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function mockBriefToRow(brief: MockBrand["activeBriefs"][number], brandId: string): Brief {
  return {
    id: brief.id,
    brand_id: brandId,
    title: brief.title,
    description: brief.description,
    budget_min: brief.budget.min,
    budget_max: brief.budget.max,
    platform: brief.platform,
    goal: brief.goal as Brief["goal"],
    content_formats: brief.contentFormat,
    timeline: brief.timeline,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

type MockDeal = (typeof mockDealsJson)[number];

function mockDealToRow(d: MockDeal): Deal {
  return {
    id: d.id,
    brand_id: d.brandId,
    creator_id: d.creatorId,
    brief_id: null,
    status: d.status as Deal["status"],
    brief_title: d.brief.title,
    brief_budget_min: d.brief.budget.min,
    brief_budget_max: d.brief.budget.max,
    brief_format: d.brief.format,
    brief_timeline: d.brief.timeline,
    brief_goal: d.brief.goal,
    brief_deliverables: d.brief.deliverables,
    brief_exclusivity_category: d.brief.exclusivity?.category ?? null,
    brief_exclusivity_window: d.brief.exclusivity?.window ?? null,
    match_score: d.matchScore,
    agreed_rate: ("agreedRate" in d ? (d as Record<string, unknown>).agreedRate as number : null) ?? null,
    campaign_url: ("campaignUrl" in d ? (d as Record<string, unknown>).campaignUrl as string : null) ?? null,
    projected_views: ("performance" in d ? (d as Record<string, unknown> & { performance?: { projectedViews?: number } }).performance?.projectedViews : null) ?? null,
    actual_views: ("performance" in d ? (d as Record<string, unknown> & { performance?: { actualViews?: number } }).performance?.actualViews : null) ?? null,
    projected_engagements: ("performance" in d ? (d as Record<string, unknown> & { performance?: { projectedEngagements?: number } }).performance?.projectedEngagements : null) ?? null,
    actual_engagements: ("performance" in d ? (d as Record<string, unknown> & { performance?: { actualEngagements?: number } }).performance?.actualEngagements : null) ?? null,
    days_live: ("performance" in d ? (d as Record<string, unknown> & { performance?: { daysLive?: number } }).performance?.daysLive : null) ?? null,
    performance_status: ("performance" in d ? (d as Record<string, unknown> & { performance?: { status?: string } }).performance?.status as Deal["performance_status"] : null) ?? null,
    created_at: d.createdAt,
    updated_at: d.createdAt,
  };
}

function mockDealMessages(d: MockDeal): DealMessage[] {
  return (d.messages || []).map((m) => ({
    id: m.id,
    deal_id: d.id,
    sender_type: m.sender as "brand" | "creator",
    sender_name: m.senderName,
    text: m.text,
    sent_at: m.timestamp,
  }));
}

function mockNotificationToRow(n: (typeof mockNotificationsJson)[number]): Notification {
  return {
    id: n.id,
    type: n.type as Notification["type"],
    title: n.title,
    body: n.body,
    recipient_type: n.recipientType as Notification["recipient_type"],
    recipient_id: n.recipientId,
    related_id: n.relatedId,
    read: n.read,
    created_at: n.timestamp,
  };
}

// ── Public data access functions ──────────────────────────────────────────

export async function getCreators(): Promise<CreatorProfile[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("creator_profiles")
      .select("*")
      .order("score_overall", { ascending: false });
    if (!error && data && data.length > 0) return data;
  }
  return mockCreatorsJson.map(mockCreatorToRow);
}

export async function getCreatorById(id: string): Promise<CreatorProfile | null> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("creator_profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && data) return data;
  }
  const mock = mockCreatorsJson.find((c) => c.id === id);
  return mock ? mockCreatorToRow(mock) : null;
}

export async function getCreatorVideos(creatorId: string): Promise<CreatorVideo[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("creator_videos")
      .select("*")
      .eq("creator_id", creatorId)
      .order("published_at", { ascending: false });
    if (!error && data && data.length > 0) return data;
  }
  const mock = mockCreatorsJson.find((c) => c.id === creatorId);
  return mock ? mockCreatorVideos(mock) : [];
}

export async function getBrands(): Promise<Brand[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb.from("brands").select("*");
    if (!error && data && data.length > 0) return data;
  }
  return mockBrandsJson.map(mockBrandToRow);
}

export async function getBrandById(id: string): Promise<Brand | null> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("brands")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && data) return data;
  }
  const mock = mockBrandsJson.find((b) => b.id === id);
  return mock ? mockBrandToRow(mock) : null;
}

export async function getBriefs(brandId?: string): Promise<Brief[]> {
  const sb = getSupabase();
  if (sb) {
    let query = sb.from("briefs").select("*");
    if (brandId) query = query.eq("brand_id", brandId);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (!error && data && data.length > 0) return data;
  }
  const filteredBrands = brandId
    ? mockBrandsJson.filter((b) => b.id === brandId)
    : mockBrandsJson;
  return filteredBrands.flatMap((b) =>
    b.activeBriefs.map((brief) => mockBriefToRow(brief, b.id))
  );
}

export async function getDeals(opts?: { brandId?: string; creatorId?: string }): Promise<Deal[]> {
  const sb = getSupabase();
  if (sb) {
    let query = sb.from("deals").select("*");
    if (opts?.brandId) query = query.eq("brand_id", opts.brandId);
    if (opts?.creatorId) query = query.eq("creator_id", opts.creatorId);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (!error && data && data.length > 0) return data;
  }
  let filtered = mockDealsJson as MockDeal[];
  if (opts?.brandId) filtered = filtered.filter((d) => d.brandId === opts.brandId);
  if (opts?.creatorId) filtered = filtered.filter((d) => d.creatorId === opts.creatorId);
  return filtered.map(mockDealToRow);
}

export async function getDealById(id: string): Promise<Deal | null> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("deals")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && data) return data;
  }
  const mock = (mockDealsJson as MockDeal[]).find((d) => d.id === id);
  return mock ? mockDealToRow(mock) : null;
}

export async function getDealMessages(dealId: string): Promise<DealMessage[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("deal_messages")
      .select("*")
      .eq("deal_id", dealId)
      .order("sent_at", { ascending: true });
    if (!error && data && data.length > 0) return data;
  }
  const mock = (mockDealsJson as MockDeal[]).find((d) => d.id === dealId);
  return mock ? mockDealMessages(mock) : [];
}

export async function getNotifications(opts?: {
  recipientType?: string;
  recipientId?: string;
}): Promise<Notification[]> {
  const sb = getSupabase();
  if (sb) {
    let query = sb.from("notifications").select("*");
    if (opts?.recipientType) query = query.eq("recipient_type", opts.recipientType);
    if (opts?.recipientId) query = query.eq("recipient_id", opts.recipientId);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (!error && data && data.length > 0) return data;
  }
  let filtered = mockNotificationsJson;
  if (opts?.recipientType)
    filtered = filtered.filter((n) => n.recipientType === opts.recipientType);
  if (opts?.recipientId)
    filtered = filtered.filter((n) => n.recipientId === opts.recipientId);
  return filtered.map(mockNotificationToRow);
}

/**
 * Get a brand with its briefs in one call.
 */
export async function getBrandWithBriefs(brandId: string): Promise<{
  brand: Brand;
  briefs: Brief[];
} | null> {
  const [brand, briefs] = await Promise.all([
    getBrandById(brandId),
    getBriefs(brandId),
  ]);
  if (!brand) return null;
  return { brand, briefs };
}
