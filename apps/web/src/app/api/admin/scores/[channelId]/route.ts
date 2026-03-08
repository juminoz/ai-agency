import { NextResponse } from "next/server";
import { z } from "zod";

import { scoreChannel } from "@/lib/scoring/engine";

const ScoreQuerySchema = z.object({
  keywords: z.array(z.string()).min(1, "At least one keyword required"),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ channelId: string }> },
) {
  try {
    const { channelId } = await params;
    const body = await request.json();
    const parsed = ScoreQuerySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const scores = await scoreChannel(channelId, parsed.data.keywords);

    return NextResponse.json({
      channelId,
      scores,
    });
  } catch (error) {
    console.error("Scoring error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ channelId: string }> },
) {
  try {
    const { channelId } = await params;
    const { createServerClient } = await import("@/lib/supabase/server");
    const supabase = createServerClient();

    const { data: scores, error } = await supabase
      .from("channel_scores")
      .select("*")
      .eq("channel_id", channelId)
      .single();

    if (error || !scores) {
      return NextResponse.json(
        { error: "Scores not found. Run POST with keywords to score this channel." },
        { status: 404 },
      );
    }

    return NextResponse.json({ channelId, scores });
  } catch (error) {
    console.error("Score fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
