import { NextResponse } from "next/server";
import { z } from "zod";

import { scoreChannel } from "@/lib/scoring/engine";
import { createServerClient } from "@/lib/supabase/server";

const BulkScoreSchema = z.object({
  keywords: z.array(z.string().min(1)).min(1, "At least one keyword required"),
  mode: z.enum(["all", "unscored"]).default("unscored"),
  channelIds: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = BulkScoreSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { keywords, mode, channelIds } = parsed.data;
    const supabase = createServerClient();

    let targetIds: string[] = [];

    if (channelIds && channelIds.length > 0) {
      targetIds = channelIds;
    } else if (mode === "unscored") {
      const { data: allChannels } = await supabase
        .from("channels")
        .select("channel_id");

      const { data: scoredChannels } = await supabase
        .from("channel_scores")
        .select("channel_id");

      const scoredSet = new Set(
        (scoredChannels ?? []).map((s) => s.channel_id as string),
      );

      targetIds = (allChannels ?? [])
        .map((c) => c.channel_id as string)
        .filter((id) => !scoredSet.has(id));
    } else {
      const { data: allChannels } = await supabase
        .from("channels")
        .select("channel_id");

      targetIds = (allChannels ?? []).map((c) => c.channel_id as string);
    }

    if (targetIds.length === 0) {
      return NextResponse.json({
        summary: { total: 0, succeeded: 0, failed: 0 },
        results: [],
        message: mode === "unscored" ? "All channels are already scored" : "No channels found",
      });
    }

    const results: { channelId: string; success: boolean; overallScore?: number; error?: string }[] = [];

    for (const channelId of targetIds) {
      try {
        const scores = await scoreChannel(channelId, keywords);
        results.push({ channelId, success: true, overallScore: scores.overallScore });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        results.push({ channelId, success: false, error: message });
      }
    }

    const succeeded = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      summary: { total: targetIds.length, succeeded, failed },
      results,
    });
  } catch (error) {
    console.error("Bulk scoring error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
