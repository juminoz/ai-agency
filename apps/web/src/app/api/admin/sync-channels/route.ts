import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createServerClient } from "@/lib/supabase/server";

/**
 * POST /api/admin/sync-channels
 *
 * Creates placeholder creator_profiles for scored channels that don't have one yet.
 * This allows brands to discover analyzed channels even if the creator hasn't signed up.
 */
export async function POST() {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const supabase = createServerClient();

  // 1. Get all scored channels with their channel data
  const { data: scoredChannels, error: channelsErr } = await supabase
    .from("channels")
    .select(
      `
      channel_id,
      title,
      description,
      subscriber_count,
      video_count,
      thumbnail_url,
      custom_url,
      channel_scores!inner (
        topic_relevance,
        views_score,
        engagement_score,
        consistency_score,
        audience_match_score,
        authenticity_score,
        overall_score
      )
    `
    )
    .order("channel_id");

  if (channelsErr) {
    return NextResponse.json({ error: channelsErr.message }, { status: 500 });
  }

  if (!scoredChannels || scoredChannels.length === 0) {
    return NextResponse.json({
      synced: 0,
      skipped: 0,
      message: "No scored channels found",
    });
  }

  // 2. Get existing creator_profiles channel_ids to skip
  const { data: existingProfiles } = await supabase
    .from("creator_profiles")
    .select("channel_id")
    .not("channel_id", "is", null);

  const existingChannelIds = new Set(
    (existingProfiles ?? []).map((p) => p.channel_id)
  );

  // 3. Get interest profiles for audience data
  const { data: interestProfiles } = await supabase
    .from("interest_profiles")
    .select("channel_id, interests");

  const interestMap = new Map(
    (interestProfiles ?? []).map((ip) => [ip.channel_id, ip.interests])
  );

  // 4. Build placeholder creator_profiles for channels that don't have one
  const toInsert = [];

  for (const ch of scoredChannels) {
    if (existingChannelIds.has(ch.channel_id)) continue;

    // channel_scores comes back as an array from the join
    const score = Array.isArray(ch.channel_scores)
      ? ch.channel_scores[0]
      : ch.channel_scores;

    if (!score) continue;

    // Derive handle from custom_url or channel title
    const handle = ch.custom_url
      ? ch.custom_url.replace(/^@/, "")
      : ch.title.toLowerCase().replace(/[^a-z0-9]+/g, "_");

    const interests = interestMap.get(ch.channel_id) ?? [];

    toInsert.push({
      channel_id: ch.channel_id,
      user_id: null, // not on platform
      handle,
      name: ch.title,
      avatar: ch.thumbnail_url,
      bio: ch.description ? ch.description.substring(0, 500) : null,
      platform: "youtube",
      subscriber_count: ch.subscriber_count,
      video_count: ch.video_count,
      channel_url: ch.custom_url
        ? `https://youtube.com/${ch.custom_url}`
        : `https://youtube.com/channel/${ch.channel_id}`,
      public_profile_url: ch.custom_url
        ? `https://youtube.com/${ch.custom_url}`
        : `https://youtube.com/channel/${ch.channel_id}`,

      // Map engine scores → creator profile scores
      score_overall: score.overall_score ?? 0,
      score_topic_relevance: score.topic_relevance ?? 0,
      score_recent_views: score.views_score ?? 0,
      score_engagement_health: score.engagement_score ?? 0,
      score_authenticity: score.authenticity_score ?? 0,
      score_activity_consistency: score.consistency_score ?? 0,
      score_comment_audience_match: score.audience_match_score ?? 0,

      // Authenticity defaults
      authenticity_score: score.authenticity_score ?? 0,
      fake_follower_risk: "unknown",
      view_spike_detected: false,
      comment_quality: 0,
      like_to_view_normality: 0,

      // Audience interests from interest_profiles
      audience_interests: interests,

      // Empty track record (no deals yet)
      completed_campaigns: 0,
      delivery_rate: 100,
      avg_rating: 0,
      deal_history: [],

      // Default availability
      availability_status: "open",
      minimum_deal_size: 0,
      categories: [],
      niche_tags: [],
      brand_preferences_open: [],
      brand_preferences_blocked: [],
    });
  }

  if (toInsert.length === 0) {
    return NextResponse.json({
      synced: 0,
      skipped: scoredChannels.length,
      message: "All scored channels already have creator profiles",
    });
  }

  // 5. Insert in batches of 50
  let synced = 0;
  const errors: string[] = [];

  for (let i = 0; i < toInsert.length; i += 50) {
    const batch = toInsert.slice(i, i + 50);
    const { error: insertErr } = await supabase
      .from("creator_profiles")
      .insert(batch);

    if (insertErr) {
      errors.push(`Batch ${i / 50 + 1}: ${insertErr.message}`);
    } else {
      synced += batch.length;
    }
  }

  // 6. Also sync recent videos for newly created profiles
  if (synced > 0) {
    // Get the newly inserted profiles to map creator_id
    const newChannelIds = toInsert.slice(0, synced).map((p) => p.channel_id);
    const { data: newProfiles } = await supabase
      .from("creator_profiles")
      .select("id, channel_id")
      .in("channel_id", newChannelIds);

    if (newProfiles && newProfiles.length > 0) {
      const profileMap = new Map(newProfiles.map((p) => [p.channel_id, p.id]));

      // Get recent videos for these channels
      for (const channelId of newChannelIds) {
        const creatorId = profileMap.get(channelId);
        if (!creatorId) continue;

        const { data: videos } = await supabase
          .from("videos")
          .select(
            "video_id, title, published_at, view_count, like_count, comment_count"
          )
          .eq("channel_id", channelId)
          .order("published_at", { ascending: false })
          .limit(10);

        if (videos && videos.length > 0) {
          const videoRows = videos.map((v) => {
            const views = v.view_count || 1;
            const engagementRate =
              ((v.like_count + v.comment_count) / views) * 100;
            return {
              creator_id: creatorId,
              video_id: v.video_id,
              title: v.title,
              published_at: v.published_at,
              views: v.view_count,
              likes: v.like_count,
              comments: v.comment_count,
              engagement_rate: Math.round(engagementRate * 100) / 100,
            };
          });

          await supabase.from("creator_videos").insert(videoRows);
        }
      }
    }
  }

  return NextResponse.json({
    synced,
    skipped: existingChannelIds.size,
    total: scoredChannels.length,
    errors: errors.length > 0 ? errors : undefined,
    message: `Synced ${synced} channels as creator profiles`,
  });
}
