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

// ── Creator Profiles ─────────────────────────────────────────────────────

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

export async function getCreatorByUserId(
  userId: string
): Promise<CreatorProfile | null> {
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
  profile: Partial<CreatorProfile> & { user_id: string }
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
  brand: Partial<Brand> & { user_id: string }
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
  let query = sb.from("briefs").select("*");
  if (brandId) query = query.eq("brand_id", brandId);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

// ── Deals ────────────────────────────────────────────────────────────────

export async function getDeals(opts?: {
  brandId?: string;
  creatorId?: string;
}): Promise<Deal[]> {
  const sb = getSupabase();
  let query = sb.from("deals").select("*");
  if (opts?.brandId) query = query.eq("brand_id", opts.brandId);
  if (opts?.creatorId) query = query.eq("creator_id", opts.creatorId);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
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
  status: Deal["status"]
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
}): Promise<(Deal & { brand_name: string; creator_name: string })[]> {
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
  let query = sb.from("notifications").select("*");
  if (opts?.recipientType)
    query = query.eq("recipient_type", opts.recipientType);
  if (opts?.recipientId) query = query.eq("recipient_id", opts.recipientId);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
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
