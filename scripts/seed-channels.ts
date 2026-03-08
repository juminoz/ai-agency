/**
 * Seed script: reads a CSV of channel IDs and runs the ingestion pipeline.
 *
 * Usage:
 *   npx tsx scripts/seed-channels.ts channels.csv
 *   npx tsx scripts/seed-channels.ts --ids UC_x5XG1OV2P6uZZ5FSM9Ttw,UCzwPKK7dTlO2W21g122MNkQ
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   YOUTUBE_API_KEY
 */

import * as fs from "fs";
import * as path from "path";

// Load env from apps/web/.env.local
const envPath = path.resolve(__dirname, "../apps/web/.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex);
    const value = trimmed.slice(eqIndex + 1);
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage:");
    console.error("  npx tsx scripts/seed-channels.ts <file.csv>");
    console.error(
      "  npx tsx scripts/seed-channels.ts --ids <id1>,<id2>,<id3>",
    );
    process.exit(1);
  }

  let channelIds: string[] = [];

  if (args[0] === "--ids" && args[1]) {
    channelIds = args[1].split(",").map((s) => s.trim()).filter(Boolean);
  } else {
    const filePath = path.resolve(args[0]!);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

    // Skip header if it looks like one
    const start = /^(channel_id|handle|id)$/i.test(lines[0] ?? "") ? 1 : 0;
    channelIds = lines.slice(start).filter(Boolean);
  }

  if (channelIds.length === 0) {
    console.error("No channel IDs found.");
    process.exit(1);
  }

  console.log(`\nSeeding ${channelIds.length} channels...\n`);

  // Dynamic import to ensure env is loaded first
  const { ingestChannel } = await import(
    "../apps/web/src/lib/youtube/pipeline"
  );

  let succeeded = 0;
  let failed = 0;

  for (let i = 0; i < channelIds.length; i++) {
    const id = channelIds[i]!;
    const progress = `[${i + 1}/${channelIds.length}]`;

    try {
      const result = await ingestChannel(id);

      if (result.success) {
        console.log(
          `${progress} ✓ ${result.title} — ${result.videosIngested} videos, ${result.commentsIngested} comments`,
        );
        succeeded++;
      } else {
        console.error(`${progress} ✗ ${id}: ${result.error}`);
        failed++;
      }
    } catch (error) {
      console.error(
        `${progress} ✗ ${id}: ${error instanceof Error ? error.message : error}`,
      );
      failed++;
    }
  }

  console.log(`\nDone. Succeeded: ${succeeded}, Failed: ${failed}`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
