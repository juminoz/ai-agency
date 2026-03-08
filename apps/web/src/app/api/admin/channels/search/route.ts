import { NextResponse } from "next/server";
import { z } from "zod";

import { matchChannels } from "@/lib/matching/matcher";

const SearchSchema = z.object({
  keywords: z.array(z.string()).min(1, "At least one keyword required"),
  minSubscribers: z.number().int().min(0).optional(),
  maxSubscribers: z.number().int().min(0).optional(),
  minScore: z.number().min(0).max(100).optional(),
  sortBy: z
    .enum(["overall_score", "views_score", "engagement_score", "subscriber_count"])
    .optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = SearchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const results = await matchChannels(parsed.data);

    return NextResponse.json({
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Channel search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
