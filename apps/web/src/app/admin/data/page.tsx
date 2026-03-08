import Link from "next/link";

import { BulkAnalyzer } from "@/components/bulk-analyzer";
import { BulkScorer } from "@/components/bulk-scorer";
import { ChannelCard } from "@/components/channel-card";
import { DataTabs } from "@/components/data-tabs";
import { createServerClient } from "@/lib/supabase/server";
import { type Channel, type ChannelScore } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function DataPage() {
  const supabase = createServerClient();

  // Fetch all channels
  const { data: allChannelsData } = await supabase
    .from("channels")
    .select("*")
    .order("fetched_at", { ascending: false });

  const allChannels = (allChannelsData ?? []) as Channel[];

  // Fetch all scores
  const { data: scores } = await supabase.from("channel_scores").select("*");

  const scoreMap = new Map(
    ((scores ?? []) as ChannelScore[]).map((s) => [s.channel_id, s])
  );

  // Split into scored and unscored
  const scoredChannels = allChannels
    .filter((c) => scoreMap.has(c.channel_id))
    .sort((a, b) => {
      const sa = scoreMap.get(a.channel_id)?.overall_score ?? 0;
      const sb = scoreMap.get(b.channel_id)?.overall_score ?? 0;
      return sb - sa;
    });

  const unscoredChannels = allChannels.filter(
    (c) => !scoreMap.has(c.channel_id)
  );

  const channelsContent =
    allChannels.length === 0 ? (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <h2 className="text-lg font-medium">No channels yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Import channels via the Import page or POST to /api/admin/channels
        </p>
      </div>
    ) : (
      <div className="space-y-6">
        {scoredChannels.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">
              Scored ({scoredChannels.length})
            </h2>
            <div className="grid gap-3">
              {scoredChannels.map((channel) => {
                const score = scoreMap.get(channel.channel_id);
                return (
                  <ChannelCard
                    key={channel.channel_id}
                    channelId={channel.channel_id}
                    description={channel.description}
                    overallScore={score?.overall_score}
                    subscriberCount={channel.subscriber_count}
                    thumbnailUrl={channel.thumbnail_url}
                    title={channel.title}
                    videoCount={channel.video_count}
                  />
                );
              })}
            </div>
          </div>
        )}

        {unscoredChannels.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">
              Unscored ({unscoredChannels.length})
            </h2>
            <div className="grid gap-3">
              {unscoredChannels.map((channel) => (
                <ChannelCard
                  key={channel.channel_id}
                  channelId={channel.channel_id}
                  description={channel.description}
                  subscriberCount={channel.subscriber_count}
                  thumbnailUrl={channel.thumbnail_url}
                  title={channel.title}
                  videoCount={channel.video_count}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );

  const toolsContent = (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Link
          className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          href="/admin/data/import"
        >
          Import
        </Link>
        <Link
          className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          href="/admin/data/search"
        >
          Search
        </Link>
        <Link
          className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          href="/admin/data/simulate"
        >
          Simulator
        </Link>
        <Link
          className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          href="/admin/data/analytics"
        >
          Analytics
        </Link>
      </div>

      <BulkScorer />

      <BulkAnalyzer />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Data Pipeline</h1>
        <p className="text-sm text-muted-foreground">
          {allChannels.length} channels imported &middot;{" "}
          {scoredChannels.length} scored &middot; {unscoredChannels.length}{" "}
          unscored
        </p>
      </div>

      <DataTabs channelsContent={channelsContent} toolsContent={toolsContent} />
    </div>
  );
}
