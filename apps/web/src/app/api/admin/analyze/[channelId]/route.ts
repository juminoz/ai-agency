import { NextResponse } from "next/server";
import { z } from "zod";

import { analyzeAuthenticity } from "@/lib/ai/authenticity";
import { analyzeComments } from "@/lib/ai/comment-analyzer";
import { buildInterestGraph } from "@/lib/ai/interest-graph";
import { createServerClient } from "@/lib/supabase/server";
import { type Comment, type Video } from "@/lib/supabase/types";

const AnalyzeSchema = z.object({
  analyses: z
    .array(z.enum(["comment_sentiment", "authenticity", "interest_graph"]))
    .min(1),
  brandContext: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ channelId: string }> },
) {
  try {
    const { channelId } = await params;
    const body = await request.json();
    const parsed = AnalyzeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const supabase = createServerClient();

    // Verify channel exists
    const { data: channel } = await supabase
      .from("channels")
      .select("subscriber_count")
      .eq("channel_id", channelId)
      .single();

    if (!channel) {
      return NextResponse.json(
        { error: "Channel not found. Ingest it first via POST /api/channels." },
        { status: 404 },
      );
    }

    // Fetch videos and comments
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

    const results: Record<string, unknown> = {};

    for (const analysisType of parsed.data.analyses) {
      let result: unknown;

      switch (analysisType) {
        case "comment_sentiment":
          result = await analyzeComments(
            typedComments,
            parsed.data.brandContext,
          );
          break;
        case "authenticity":
          result = analyzeAuthenticity(
            typedVideos,
            typedComments,
            subscriberCount,
          );
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

      // If interest graph, also store in interest_profiles
      if (
        analysisType === "interest_graph" &&
        result &&
        typeof result === "object" &&
        "interests" in result
      ) {
        const graphResult = result as { interests: unknown[] };
        await supabase.from("interest_profiles").upsert(
          {
            channel_id: channelId,
            interests: graphResult.interests,
          },
          { onConflict: "channel_id" },
        );
      }

      // If authenticity, update channel_scores
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

      results[analysisType] = result;
    }

    return NextResponse.json({ channelId, results });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
