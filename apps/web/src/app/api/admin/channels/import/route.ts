import { NextResponse } from "next/server";
import * as Papa from "papaparse";
import { z } from "zod";

import { type PipelineResult, ingestChannel } from "@/lib/youtube/pipeline";

const JsonImportSchema = z.object({
  channels: z.array(z.string().min(1)).min(1).max(100),
});

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let channelIds: string[] = [];

    if (contentType.includes("application/json")) {
      const body = await request.json();
      const parsed = JsonImportSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Provide { channels: ["channelId1", "channelId2", ...] }' },
          { status: 400 }
        );
      }
      channelIds = parsed.data.channels;
    } else if (
      contentType.includes("text/csv") ||
      contentType.includes("multipart/form-data")
    ) {
      const text = await request.text();
      const parsed = Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: true,
      });

      channelIds = parsed.data
        .map((row) => row.channel_id || row.handle || row.id || "")
        .filter(Boolean);

      if (channelIds.length === 0) {
        return NextResponse.json(
          {
            error:
              "CSV must have a column named 'channel_id', 'handle', or 'id'",
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Content-Type must be application/json or text/csv" },
        { status: 400 }
      );
    }

    if (channelIds.length > 100) {
      return NextResponse.json(
        { error: "Maximum 100 channels per import" },
        { status: 400 }
      );
    }

    const results: PipelineResult[] = [];

    for (const channelId of channelIds) {
      const result = await ingestChannel(channelId);
      results.push(result);
    }

    const succeeded = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      summary: {
        total: channelIds.length,
        succeeded,
        failed,
      },
      results,
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
