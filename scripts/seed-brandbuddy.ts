/**
 * Seed script: applies migration 003 and seeds BrandBuddy marketplace data.
 *
 * Usage:
 *   npx tsx scripts/seed-brandbuddy.ts
 *
 * Requires apps/web/.env.local with:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

// ── Load env ──────────────────────────────────────────────────────────────
const envPath = path.resolve(__dirname, "../apps/web/.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex);
    const value = trimmed.slice(eqIndex + 1);
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE env vars. Check apps/web/.env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// ── Load mock data ────────────────────────────────────────────────────────
const mockDir = path.resolve(__dirname, "../apps/web/src/data/mock");
const creators = JSON.parse(fs.readFileSync(path.join(mockDir, "creators.json"), "utf-8"));
const brands = JSON.parse(fs.readFileSync(path.join(mockDir, "brands.json"), "utf-8"));
const deals = JSON.parse(fs.readFileSync(path.join(mockDir, "deals.json"), "utf-8"));
const notifications = JSON.parse(fs.readFileSync(path.join(mockDir, "notifications.json"), "utf-8"));

// ── Step 1: Apply migration via raw SQL ───────────────────────────────────
async function applyMigration() {
  console.log("📦 Applying migration 003_brandbuddy_schema.sql...");
  const sql = fs.readFileSync(
    path.resolve(__dirname, "../supabase/migrations/003_brandbuddy_schema.sql"),
    "utf-8"
  );

  // Execute via Supabase Management API (pg endpoint)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });

  // The REST API can't run DDL. We'll use the rpc approach by first creating a helper function.
  // Alternative: use the Supabase SQL Editor API endpoint
  const sqlApiUrl = SUPABASE_URL.replace(".supabase.co", ".supabase.co");

  // Use the Supabase pg_net or direct SQL API
  // Actually, let's use the Supabase Management API v1
  const projectRef = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "");

  console.log(`   Project ref: ${projectRef}`);
  console.log("   ⚠️  Migration must be applied via Supabase Dashboard SQL Editor.");
  console.log("   Copy the SQL from: supabase/migrations/003_brandbuddy_schema.sql");
  console.log("   Paste into: https://supabase.com/dashboard/project/" + projectRef + "/sql/new");
  console.log("");
  console.log("   Checking if tables already exist...");

  // Check if creator_profiles table exists
  const { data, error } = await supabase.from("creator_profiles").select("id").limit(1);
  if (error && error.code === "42P01") {
    console.log("   ❌ Tables don't exist yet. Please apply the migration first.");
    console.log("   Then re-run this script to seed data.");
    process.exit(1);
  } else if (error && error.message.includes("does not exist")) {
    console.log("   ❌ Tables don't exist yet. Please apply the migration first.");
    process.exit(1);
  } else {
    console.log("   ✅ Tables exist. Proceeding with seed data...");
  }
}

// ── Step 2: Seed creator profiles ─────────────────────────────────────────
async function seedCreators() {
  console.log("🎨 Seeding creator profiles...");

  for (const c of creators) {
    const row = {
      id: c.id,
      user_id: null, // no real user yet
      channel_id: null, // no real channel yet
      handle: c.handle,
      name: c.name,
      avatar: c.avatar,
      bio: c.bio,
      platform: c.platform,
      subscriber_count: c.subscriberCount,
      video_count: c.videoCount,
      categories: c.categories,
      niche_tags: c.nicheTags,
      availability_status: c.availabilityStatus,
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
    };

    const { error } = await supabase
      .from("creator_profiles")
      .upsert(row, { onConflict: "id" });

    if (error) {
      console.error(`   ❌ Creator ${c.name}: ${error.message}`);
    } else {
      console.log(`   ✅ ${c.name}`);
    }

    // Seed recent videos
    for (const v of c.recentVideos) {
      const { error: vErr } = await supabase
        .from("creator_videos")
        .upsert(
          {
            id: v.id,
            creator_id: c.id,
            video_id: v.id,
            title: v.title,
            published_at: v.publishedAt,
            views: v.views,
            likes: v.likes,
            comments: v.comments,
            engagement_rate: v.engagementRate,
          },
          { onConflict: "id" }
        );
      if (vErr) {
        console.error(`   ❌ Video ${v.title}: ${vErr.message}`);
      }
    }
  }
}

// ── Step 3: Seed brands ───────────────────────────────────────────────────
async function seedBrands() {
  console.log("🏢 Seeding brands...");

  for (const b of brands) {
    const row = {
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
    };

    const { error } = await supabase
      .from("brands")
      .upsert(row, { onConflict: "id" });

    if (error) {
      console.error(`   ❌ Brand ${b.name}: ${error.message}`);
    } else {
      console.log(`   ✅ ${b.name}`);
    }

    // Seed briefs
    for (const brief of b.activeBriefs) {
      const { error: bErr } = await supabase
        .from("briefs")
        .upsert(
          {
            id: brief.id,
            brand_id: b.id,
            title: brief.title,
            description: brief.description,
            budget_min: brief.budget.min,
            budget_max: brief.budget.max,
            platform: brief.platform,
            goal: brief.goal,
            content_formats: brief.contentFormat,
            timeline: brief.timeline,
            status: "active",
          },
          { onConflict: "id" }
        );
      if (bErr) {
        console.error(`   ❌ Brief ${brief.title}: ${bErr.message}`);
      }
    }
  }
}

// ── Step 4: Seed deals ────────────────────────────────────────────────────
async function seedDeals() {
  console.log("🤝 Seeding deals...");

  for (const d of deals) {
    const row = {
      id: d.id,
      brand_id: d.brandId,
      creator_id: d.creatorId,
      brief_id: null, // deals reference briefs loosely in mock data
      status: d.status,
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
      agreed_rate: d.agreedRate ?? null,
      campaign_url: d.campaignUrl ?? null,
      projected_views: d.performance?.projectedViews ?? null,
      actual_views: d.performance?.actualViews ?? null,
      projected_engagements: d.performance?.projectedEngagements ?? null,
      actual_engagements: d.performance?.actualEngagements ?? null,
      days_live: d.performance?.daysLive ?? null,
      performance_status: d.performance?.status ?? null,
      created_at: d.createdAt,
    };

    const { error } = await supabase
      .from("deals")
      .upsert(row, { onConflict: "id" });

    if (error) {
      console.error(`   ❌ Deal ${d.id}: ${error.message}`);
    } else {
      console.log(`   ✅ ${d.id} (${d.brandName} ↔ ${d.creatorName})`);
    }

    // Seed messages
    for (const m of d.messages || []) {
      const { error: mErr } = await supabase
        .from("deal_messages")
        .upsert(
          {
            id: m.id,
            deal_id: d.id,
            sender_type: m.sender,
            sender_name: m.senderName,
            text: m.text,
            sent_at: m.timestamp,
          },
          { onConflict: "id" }
        );
      if (mErr) {
        console.error(`   ❌ Message ${m.id}: ${mErr.message}`);
      }
    }

    // Seed reviews
    if (d.review) {
      if (d.review.brandReview) {
        const { error: rErr } = await supabase
          .from("deal_reviews")
          .upsert(
            {
              id: `${d.id}-brand-review`,
              deal_id: d.id,
              reviewer_type: "brand",
              delivery_rating: d.review.brandReview.delivery,
              communication_rating: d.review.brandReview.communication,
              overall_rating: d.review.brandReview.overall,
              note: d.review.brandReview.note,
            },
            { onConflict: "id" }
          );
        if (rErr) console.error(`   ❌ Brand review: ${rErr.message}`);
      }
      if (d.review.creatorReview) {
        const { error: rErr } = await supabase
          .from("deal_reviews")
          .upsert(
            {
              id: `${d.id}-creator-review`,
              deal_id: d.id,
              reviewer_type: "creator",
              delivery_rating: d.review.creatorReview.delivery,
              communication_rating: d.review.creatorReview.communication,
              overall_rating: d.review.creatorReview.overall,
              note: d.review.creatorReview.note,
            },
            { onConflict: "id" }
          );
        if (rErr) console.error(`   ❌ Creator review: ${rErr.message}`);
      }
    }
  }
}

// ── Step 5: Seed notifications ────────────────────────────────────────────
async function seedNotifications() {
  console.log("🔔 Seeding notifications...");

  for (const n of notifications) {
    const { error } = await supabase
      .from("notifications")
      .upsert(
        {
          id: n.id,
          type: n.type,
          title: n.title,
          body: n.body,
          recipient_type: n.recipientType,
          recipient_id: n.recipientId,
          related_id: n.relatedId,
          read: n.read,
          created_at: n.timestamp,
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error(`   ❌ Notification ${n.id}: ${error.message}`);
    } else {
      console.log(`   ✅ ${n.title}`);
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 BrandBuddy Seed Script");
  console.log("=".repeat(50));
  console.log("");

  await applyMigration();
  console.log("");

  await seedCreators();
  console.log("");

  await seedBrands();
  console.log("");

  await seedDeals();
  console.log("");

  await seedNotifications();
  console.log("");

  console.log("=".repeat(50));
  console.log("✅ Seed complete!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
