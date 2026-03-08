import { NextResponse } from "next/server";
import { z } from "zod";

import { simulateCampaign } from "@/lib/simulator/campaign";

const SimulateSchema = z.object({
  channelIds: z.array(z.string().min(1)).min(1).max(20),
  budget: z.number().positive("Budget must be positive"),
  conversionRateLow: z.number().min(0).max(1).optional(),
  conversionRateMid: z.number().min(0).max(1).optional(),
  conversionRateHigh: z.number().min(0).max(1).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = SimulateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const result = await simulateCampaign(parsed.data);

    return NextResponse.json({ simulation: result });
  } catch (error) {
    console.error("Simulation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
