/**
 * Data access layer for BrandBuddy.
 *
 * All data comes from Supabase. No mock fallbacks.
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

// ── Supabase client (service-role, server-side only) ─────────────────────

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key, { auth: { persistSession: false } });
}

<<<<<<< Updated upstream
// ── Mock data imports (static JSON, always available) ─────────────────────
import mockBrandsJson from "@/data/mock/brands.json";
import mockCreatorsJson from "@/data/mock/creators.json";
import mockDealsJson from "@/data/mock/deals.json";
import mockNotificationsJson from "@/data/mock/notifications.json";

// ── Transform mock JSON → DB row shapes ───────────────────────────────────

function mockCreatorToRow(
  c: (typeof mockCreatorsJson)[number]
): CreatorProfile {
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

function mockCreatorVideos(
  c: (typeof mockCreatorsJson)[number]
): CreatorVideo[] {
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

function mockBriefToRow(
  brief: MockBrand["activeBriefs"][number],
  brandId: string
): Brief {
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
    agreed_rate:
      ("agreedRate" in d
        ? ((d as Record<string, unknown>).agreedRate as number)
        : null) ?? null,
    campaign_url:
      ("campaignUrl" in d
        ? ((d as Record<string, unknown>).campaignUrl as string)
        : null) ?? null,
    projected_views:
      ("performance" in d
        ? (
            d as Record<string, unknown> & {
              performance?: { projectedViews?: number };
            }
          ).performance?.projectedViews
        : null) ?? null,
    actual_views:
      ("performance" in d
        ? (
            d as Record<string, unknown> & {
              performance?: { actualViews?: number };
            }
          ).performance?.actualViews
        : null) ?? null,
    projected_engagements:
      ("performance" in d
        ? (
            d as Record<string, unknown> & {
              performance?: { projectedEngagements?: number };
            }
          ).performance?.projectedEngagements
        : null) ?? null,
    actual_engagements:
      ("performance" in d
        ? (
            d as Record<string, unknown> & {
              performance?: { actualEngagements?: number };
            }
          ).performance?.actualEngagements
        : null) ?? null,
    days_live:
      ("performance" in d
        ? (
            d as Record<string, unknown> & {
              performance?: { daysLive?: number };
            }
          ).performance?.daysLive
        : null) ?? null,
    performance_status:
      ("performance" in d
        ? ((
            d as Record<string, unknown> & { performance?: { status?: string } }
          ).performance?.status as Deal["performance_status"])
        : null) ?? null,
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

function mockNotificationToRow(
  n: (typeof mockNotificationsJson)[number]
): Notification {
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

// ── CreatorProfile → camelCase view shape (used by brand-side components) ──

export interface CreatorView {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  bio: string;
  platform: string;
  isOnPlatform: boolean;
  subscriberCount: number;
  videoCount: number;
  categories: string[];
  nicheTags: string[];
  availabilityStatus: string;
  minimumDealSize: number;
  brandPreferences: { open: string[]; blocked: string[] };
  publicProfileUrl: string;
  channelUrl: string;
  score: {
    overall: number;
    topicRelevance: number;
    recentViews: number;
    engagementHealth: number;
    authenticity: number;
    activityConsistency: number;
    commentAudienceMatch: number;
  };
  nicheRanking: { percentile: number; category: string; tier: string };
  performanceTrend: {
    viewsTrend: string;
    engagementTrend: string;
    narrative: string;
  };
  audienceInterests: { category: string; confidence: number }[];
  authenticity: {
    score: number;
    fakeFollowerRisk: string;
    viewSpikeDetected: boolean;
    commentQuality: number;
    likeToViewNormality: number;
  };
  recentVideos: {
    id: string;
    title: string;
    publishedAt: string;
    views: number;
    likes: number;
    comments: number;
    engagementRate: number;
  }[];
  trackRecord: {
    completedCampaigns: number;
    deliveryRate: number;
    avgPerformanceVsProjection: string;
    avgRating: number;
  };
  dealHistory: {
    brand: string;
    rate: number;
    format: string;
    date: string;
    outcome: string;
  }[];
}

export function creatorProfileToView(
  p: CreatorProfile,
  videos: CreatorVideo[] = []
): CreatorView {
  return {
    id: p.id,
    handle: p.handle,
    name: p.name,
    avatar: p.avatar ?? "",
    bio: p.bio ?? "",
    platform: p.platform,
    isOnPlatform: p.user_id !== null,
    subscriberCount: p.subscriber_count,
    videoCount: p.video_count,
    categories: p.categories,
    nicheTags: p.niche_tags,
    availabilityStatus: p.availability_status,
    minimumDealSize: p.minimum_deal_size,
    brandPreferences: {
      open: p.brand_preferences_open,
      blocked: p.brand_preferences_blocked,
    },
    publicProfileUrl: p.public_profile_url ?? "",
    channelUrl: p.channel_url ?? "",
    score: {
      overall: p.score_overall,
      topicRelevance: p.score_topic_relevance,
      recentViews: p.score_recent_views,
      engagementHealth: p.score_engagement_health,
      authenticity: p.score_authenticity,
      activityConsistency: p.score_activity_consistency,
      commentAudienceMatch: p.score_comment_audience_match,
    },
    nicheRanking: {
      percentile: p.niche_percentile,
      category: p.niche_category ?? "",
      tier: p.niche_tier ?? "",
    },
    performanceTrend: {
      viewsTrend: p.views_trend ?? "",
      engagementTrend: p.engagement_trend ?? "",
      narrative: p.trend_narrative ?? "",
    },
    audienceInterests: p.audience_interests,
    authenticity: {
      score: p.authenticity_score,
      fakeFollowerRisk: p.fake_follower_risk,
      viewSpikeDetected: p.view_spike_detected,
      commentQuality: p.comment_quality,
      likeToViewNormality: p.like_to_view_normality,
    },
    recentVideos: videos.map((v) => ({
      id: v.video_id ?? v.id,
      title: v.title,
      publishedAt: v.published_at ?? "",
      views: v.views,
      likes: v.likes,
      comments: v.comments,
      engagementRate: v.engagement_rate,
    })),
    trackRecord: {
      completedCampaigns: p.completed_campaigns,
      deliveryRate: p.delivery_rate,
      avgPerformanceVsProjection: p.avg_performance_vs_projection ?? "",
      avgRating: p.avg_rating,
    },
    dealHistory: p.deal_history,
  };
}

// ── Public data access functions ──────────────────────────────────────────
=======
// ── Creator Profiles ─────────────────────────────────────────────────────
>>>>>>> Stashed changes

export async function getCreators(): Promise<CreatorProfile[]> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("creator_profiles")
    .select("*")
    .order("score_overall", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getCreatorById(
  id: string
): Promise<CreatorProfile | null> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("creator_profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getCreatorByUserId(userId: string): Promise<CreatorProfile | null> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("creator_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) return null;
  return data;
}

/**
 * Create or update a creator profile. Uses user_id as the identity key.
 */
export async function upsertCreatorProfile(
  profile: Partial<CreatorProfile> & { user_id: string },
): Promise<CreatorProfile> {
  const sb = getSupabase();

  // Check if exists
  const existing = await getCreatorByUserId(profile.user_id);

  if (existing) {
    const { data, error } = await sb
      .from("creator_profiles")
      .update(profile)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await sb
      .from("creator_profiles")
      .insert(profile)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export async function getCreatorVideos(
  creatorId: string
): Promise<CreatorVideo[]> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("creator_videos")
    .select("*")
    .eq("creator_id", creatorId)
    .order("published_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

// ── Brands ───────────────────────────────────────────────────────────────

export async function getBrands(): Promise<Brand[]> {
  const sb = getSupabase();
  const { data, error } = await sb.from("brands").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getBrandById(id: string): Promise<Brand | null> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("brands")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getBrandByUserId(userId: string): Promise<Brand | null> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("brands")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) return null;
  return data;
}

/**
 * Create or update a brand. Uses user_id as the identity key.
 */
export async function upsertBrand(
  brand: Partial<Brand> & { user_id: string },
): Promise<Brand> {
  const sb = getSupabase();

  const existing = await getBrandByUserId(brand.user_id);

  if (existing) {
    const { data, error } = await sb
      .from("brands")
      .update(brand)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await sb
      .from("brands")
      .insert(brand)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// ── Briefs ───────────────────────────────────────────────────────────────

export async function getBriefs(brandId?: string): Promise<Brief[]> {
  const sb = getSupabase();
<<<<<<< Updated upstream
  if (sb) {
    let query = sb.from("briefs").select("*");
    if (brandId) query = query.eq("brand_id", brandId);
    const { data, error } = await query.order("created_at", {
      ascending: false,
    });
    if (!error && data && data.length > 0) return data;
  }
  const filteredBrands = brandId
    ? mockBrandsJson.filter((b) => b.id === brandId)
    : mockBrandsJson;
  return filteredBrands.flatMap((b) =>
    b.activeBriefs.map((brief) => mockBriefToRow(brief, b.id))
  );
}

=======
  let query = sb.from("briefs").select("*");
  if (brandId) query = query.eq("brand_id", brandId);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

// ── Deals ────────────────────────────────────────────────────────────────

>>>>>>> Stashed changes
export async function getDeals(opts?: {
  brandId?: string;
  creatorId?: string;
}): Promise<Deal[]> {
  const sb = getSupabase();
<<<<<<< Updated upstream
  if (sb) {
    let query = sb.from("deals").select("*");
    if (opts?.brandId) query = query.eq("brand_id", opts.brandId);
    if (opts?.creatorId) query = query.eq("creator_id", opts.creatorId);
    const { data, error } = await query.order("created_at", {
      ascending: false,
    });
    if (!error && data && data.length > 0) return data;
  }
  let filtered = mockDealsJson as MockDeal[];
  if (opts?.brandId)
    filtered = filtered.filter((d) => d.brandId === opts.brandId);
  if (opts?.creatorId)
    filtered = filtered.filter((d) => d.creatorId === opts.creatorId);
  return filtered.map(mockDealToRow);
=======
  let query = sb.from("deals").select("*");
  if (opts?.brandId) query = query.eq("brand_id", opts.brandId);
  if (opts?.creatorId) query = query.eq("creator_id", opts.creatorId);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
>>>>>>> Stashed changes
}

export async function getDealById(id: string): Promise<Deal | null> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("deals")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getDealMessages(dealId: string): Promise<DealMessage[]> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("deal_messages")
    .select("*")
    .eq("deal_id", dealId)
    .order("sent_at", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function sendDealMessage(msg: {
  deal_id: string;
  sender_type: "brand" | "creator";
  sender_name: string | null;
  text: string;
}): Promise<DealMessage> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("deal_messages")
    .insert(msg)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Find an existing deal between a brand and creator, or create one.
 */
export async function findOrCreateDeal(opts: {
  brandId: string;
  creatorId: string;
  briefTitle?: string;
}): Promise<Deal> {
  const sb = getSupabase();

  // Check for existing deal
  const { data: existing } = await sb
    .from("deals")
    .select("*")
    .eq("brand_id", opts.brandId)
    .eq("creator_id", opts.creatorId)
    .in("status", ["received", "negotiating", "agreed", "live"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (existing) return existing;

  // Create a new deal
  const { data, error } = await sb
    .from("deals")
    .insert({
      brand_id: opts.brandId,
      creator_id: opts.creatorId,
      status: "received",
      brief_title: opts.briefTitle ?? "Direct Message",
      brief_budget_min: 0,
      brief_budget_max: 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDealStatus(
  dealId: string,
  status: Deal["status"],
): Promise<Deal> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("deals")
    .update({ status })
    .eq("id", dealId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getDealsWithNames(opts?: {
  brandId?: string;
  creatorId?: string;
}): Promise<
  (Deal & { brand_name: string; creator_name: string })[]
> {
  const sb = getSupabase();
  let query = sb
    .from("deals")
    .select("*, brands!inner(name), creator_profiles!inner(name)");
  if (opts?.brandId) query = query.eq("brand_id", opts.brandId);
  if (opts?.creatorId) query = query.eq("creator_id", opts.creatorId);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    ...row,
    brand_name: row.brands?.name ?? "Unknown Brand",
    creator_name: row.creator_profiles?.name ?? "Unknown Creator",
    brands: undefined,
    creator_profiles: undefined,
  }));
}

// ── Notifications ────────────────────────────────────────────────────────

export async function getNotifications(opts?: {
  recipientType?: string;
  recipientId?: string;
}): Promise<Notification[]> {
  const sb = getSupabase();
<<<<<<< Updated upstream
  if (sb) {
    let query = sb.from("notifications").select("*");
    if (opts?.recipientType)
      query = query.eq("recipient_type", opts.recipientType);
    if (opts?.recipientId) query = query.eq("recipient_id", opts.recipientId);
    const { data, error } = await query.order("created_at", {
      ascending: false,
    });
    if (!error && data && data.length > 0) return data;
  }
  let filtered = mockNotificationsJson;
  if (opts?.recipientType)
    filtered = filtered.filter((n) => n.recipientType === opts.recipientType);
  if (opts?.recipientId)
    filtered = filtered.filter((n) => n.recipientId === opts.recipientId);
  return filtered.map(mockNotificationToRow);
=======
  let query = sb.from("notifications").select("*");
  if (opts?.recipientType) query = query.eq("recipient_type", opts.recipientType);
  if (opts?.recipientId) query = query.eq("recipient_id", opts.recipientId);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
>>>>>>> Stashed changes
}

// ── Composite helpers ────────────────────────────────────────────────────

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
