import { NextResponse } from "next/server";
import { z } from "zod";

import { analyzeAuthenticity } from "@/lib/ai/authenticity";
import { analyzeComments } from "@/lib/ai/comment-analyzer";
import { buildInterestGraph } from "@/lib/ai/interest-graph";
import { createServerClient } from "@/lib/supabase/server";
import { type Comment, type Video } from "@/lib/supabase/types";

const BulkAnalyzeSchema = z.object({
  analyses: z
    .array(z.enum(["comment_sentiment", "authenticity", "interest_graph"]))
    .min(1, "Select at least one analysis type"),
  brandContext: z.string().optional(),
  mode: z.enum(["all", "unanalyzed"]).default("unanalyzed"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = BulkAnalyzeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { analyses, brandContext, mode } = parsed.data;
    const supabase = createServerClient();

    // Get all channels
    const { data: allChannels } = await supabase
      .from("channels")
      .select("channel_id");

    let targetIds = (allChannels ?? []).map((c) => c.channel_id as string);

    // If unanalyzed mode, filter out channels that already have ALL requested analyses
    if (mode === "unanalyzed") {
      const { data: existingAnalyses } = await supabase
        .from("ai_analyses")
        .select("channel_id, analysis_type");

      const analyzedMap = new Map<string, Set<string>>();
      for (const a of existingAnalyses ?? []) {
        const id = a.channel_id as string;
        const type = a.analysis_type as string;
        if (!analyzedMap.has(id)) analyzedMap.set(id, new Set());
        analyzedMap.get(id)!.add(type);
      }

      targetIds = targetIds.filter((id) => {
        const existing = analyzedMap.get(id);
        if (!existing) return true;
        return analyses.some((a) => !existing.has(a));
      });
    }

    if (targetIds.length === 0) {
      return NextResponse.json({
        summary: { total: 0, succeeded: 0, failed: 0 },
        results: [],
        message: mode === "unanalyzed"
          ? "All channels already have the selected analyses"
          : "No channels found",
      });
    }

    const results: {
      channelId: string;
      success: boolean;
      completed: string[];
      error?: string;
    }[] = [];

    for (const channelId of targetIds) {
      try {
        // Fetch channel data
        const { data: channel } = await supabase
          .from("channels")
          .select("subscriber_count")
          .eq("channel_id", channelId)
          .single();

        if (!channel) {
          results.push({ channelId, success: false, completed: [], error: "Channel not found" });
          continue;
        }

        const { data: videos } = await supabase
          .from("videos")
          .select("*")
          .eq("channel_id", channelId)
          .order("published_at", { ascending: false })
          .limit(50);

        const { data: comments } = await supabase
          .from("comments")
          .select("*")
          .eq("channel_id", channelId);

        const typedVideos = (videos ?? []) as Video[];
        const typedComments = (comments ?? []) as Comment[];
        const subscriberCount = (channel as { subscriber_count: number }).subscriber_count;

        const completed: string[] = [];

        for (const analysisType of analyses) {
          let result: unknown;

          switch (analysisType) {
            case "comment_sentiment":
              result = await analyzeComments(typedComments, brandContext);
              break;
            case "authenticity":
              result = analyzeAuthenticity(typedVideos, typedComments, subscriberCount);
              break;
            case "interest_graph":
              result = await buildInterestGraph(typedVideos, typedComments);
              break;
          }

          // Store analysis result
          await supabase.from("ai_analyses").insert({
            channel_id: channelId,
            analysis_type: analysisType,
            result: result as Record<string, unknown>,
          });

          // Store interest graph in interest_profiles
          if (
            analysisType === "interest_graph" &&
            result &&
            typeof result === "object" &&
            "interests" in result
          ) {
            const graphResult = result as { interests: unknown[] };
            await supabase.from("interest_profiles").upsert(
              { channel_id: channelId, interests: graphResult.interests },
              { onConflict: "channel_id" },
            );
          }

          // Update authenticity score in channel_scores
          if (
            analysisType === "authenticity" &&
            result &&
            typeof result === "object" &&
            "score" in result
          ) {
            const authResult = result as { score: number };
            await supabase
              .from("channel_scores")
              .update({ authenticity_score: authResult.score })
              .eq("channel_id", channelId);
          }

          completed.push(analysisType);
        }

        results.push({ channelId, success: true, completed });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        results.push({ channelId, success: false, completed: [], error: message });
      }
    }

    const succeeded = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      summary: { total: targetIds.length, succeeded, failed },
      results,
    });
  } catch (error) {
    console.error("Bulk analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
