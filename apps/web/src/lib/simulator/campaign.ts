import { createServerClient } from "@/lib/supabase/server";
import { type Video } from "@/lib/supabase/types";

export interface SimulationInput {
  channelIds: string[];
  budget: number;
  conversionRateLow?: number;
  conversionRateMid?: number;
  conversionRateHigh?: number;
}

export interface SimulationResult {
  totalReach: number;
  expectedEngagements: number;
  estimatedConversions: {
    low: number;
    mid: number;
    high: number;
  };
  costPerConversion: {
    low: number;
    mid: number;
    high: number;
  };
  costEfficiency: "high" | "medium" | "low";
  perChannel: ChannelProjection[];
}

export interface ChannelProjection {
  channelId: string;
  channelTitle: string;
  medianViews: number;
  medianEngagementRate: number;
  projectedReach: number;
  projectedEngagements: number;
}

/**
 * Campaign Reach Simulator
 *
 * From scoring.md section 8:
 * - Total reach = sum of median recent views across selected channels
 * - Expected engagement = apply each channel's median engagement rate to views
 * - Estimated conversions = industry benchmark (1–3% of engagements)
 * - Cost per conversion = budget / estimated conversions
 */
export async function simulateCampaign(
  input: SimulationInput
): Promise<SimulationResult> {
  const {
    channelIds,
    budget,
    conversionRateLow = 0.01,
    conversionRateMid = 0.02,
    conversionRateHigh = 0.03,
  } = input;

  const supabase = createServerClient();

  const perChannel: ChannelProjection[] = [];

  for (const rawId of channelIds) {
    // Resolve handle / custom_url → channel_id
    let channelId = rawId.trim();
    let channel: { title: string; channel_id: string } | null = null;

    if (channelId.startsWith("@") || !channelId.startsWith("UC")) {
      // Try lookup by custom_url (with or without @)
      const handle = channelId.startsWith("@") ? channelId : `@${channelId}`;
      const { data: found } = await supabase
        .from("channels")
        .select("channel_id, title")
        .eq("custom_url", handle)
        .single();

      if (found) {
        channel = found as { title: string; channel_id: string };
        channelId = channel.channel_id;
      }
    }

    // If not resolved by handle, try direct channel_id lookup
    if (!channel) {
      const { data: found } = await supabase
        .from("channels")
        .select("channel_id, title")
        .eq("channel_id", channelId)
        .single();
      channel = found as { title: string; channel_id: string } | null;
    }

    // Fetch recent videos for this channel
    const { data: videos } = await supabase
      .from("videos")
      .select("*")
      .eq("channel_id", channelId)
      .order("published_at", { ascending: false })
      .limit(20);

    const typedVideos = (videos ?? []) as Video[];
    if (typedVideos.length === 0) continue;

    const viewCounts = typedVideos
      .map((v) => v.view_count)
      .sort((a, b) => a - b);
    const medianViews = medianOf(viewCounts);

    const engagementRates = typedVideos
      .filter((v) => v.view_count > 0)
      .map((v) => (v.like_count + v.comment_count) / v.view_count);
    const medianEngagementRate =
      engagementRates.length > 0 ? medianOf(engagementRates) : 0;

    perChannel.push({
      channelId,
      channelTitle: channel?.title ?? channelId,
      medianViews,
      medianEngagementRate,
      projectedReach: medianViews,
      projectedEngagements: Math.round(medianViews * medianEngagementRate),
    });
  }

  const totalReach = perChannel.reduce((sum, c) => sum + c.projectedReach, 0);
  const expectedEngagements = perChannel.reduce(
    (sum, c) => sum + c.projectedEngagements,
    0
  );

  const conversionsLow = Math.round(expectedEngagements * conversionRateLow);
  const conversionsMid = Math.round(expectedEngagements * conversionRateMid);
  const conversionsHigh = Math.round(expectedEngagements * conversionRateHigh);

  const costPerConversionLow =
    conversionsLow > 0 ? budget / conversionsLow : Infinity;
  const costPerConversionMid =
    conversionsMid > 0 ? budget / conversionsMid : Infinity;
  const costPerConversionHigh =
    conversionsHigh > 0 ? budget / conversionsHigh : Infinity;

  // Cost efficiency: based on mid-range cost per conversion
  let costEfficiency: "high" | "medium" | "low" = "medium";
  if (costPerConversionMid <= 5) costEfficiency = "high";
  else if (costPerConversionMid >= 50) costEfficiency = "low";

  return {
    totalReach,
    expectedEngagements,
    estimatedConversions: {
      low: conversionsLow,
      mid: conversionsMid,
      high: conversionsHigh,
    },
    costPerConversion: {
      low: Math.round(costPerConversionLow * 100) / 100,
      mid: Math.round(costPerConversionMid * 100) / 100,
      high: Math.round(costPerConversionHigh * 100) / 100,
    },
    costEfficiency,
    perChannel,
  };
}

function medianOf(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
  }
  return sorted[mid] ?? 0;
}
