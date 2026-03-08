import { NextResponse } from "next/server";
import { z } from "zod";

import { ingestChannel } from "@/lib/youtube/pipeline";

const IngestSchema = z.object({
  channelId: z.string().min(1, "channelId is required"),
  maxVideos: z.number().int().min(1).max(50).optional(),
  commentsPerVideo: z.number().int().min(0).max(100).optional(),
  videosToComment: z.number().int().min(0).max(50).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = IngestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { channelId, ...options } = parsed.data;
    const result = await ingestChannel(channelId, options);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, result },
        { status: 422 },
      );
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Channel ingestion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
