import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ channelId: string }> },
) {
  try {
    const { channelId } = await params;
    const supabase = createServerClient();

    const { data: channel, error: channelError } = await supabase
      .from("channels")
      .select("*")
      .eq("channel_id", channelId)
      .single();

    if (channelError || !channel) {
      return NextResponse.json(
        { error: "Channel not found" },
        { status: 404 },
      );
    }

    const { data: scores } = await supabase
      .from("channel_scores")
      .select("*")
      .eq("channel_id", channelId)
      .single();

    const { data: interests } = await supabase
      .from("interest_profiles")
      .select("*")
      .eq("channel_id", channelId)
      .single();

    const { data: recentVideos } = await supabase
      .from("videos")
      .select("*")
      .eq("channel_id", channelId)
      .order("published_at", { ascending: false })
      .limit(20);

    return NextResponse.json({
      channel,
      scores,
      interests,
      recentVideos: recentVideos ?? [],
    });
  } catch (error) {
    console.error("Channel fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
