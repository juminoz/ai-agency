import Link from "next/link";

import { ChannelCard } from "@/components/channel-card";
import { createServerClient } from "@/lib/supabase/server";
import { type Channel, type ChannelScore } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function DataPage() {
  const supabase = createServerClient();

  const { data: scores } = await supabase
    .from("channel_scores")
    .select("*")
    .order("overall_score", { ascending: false })
    .limit(50);

  const channelIds = (scores ?? []).map(
    (s: Record<string, unknown>) => s.channel_id as string
  );

  let channels: Channel[] = [];
  if (channelIds.length > 0) {
    const { data } = await supabase
      .from("channels")
      .select("*")
      .in("channel_id", channelIds);
    channels = (data ?? []) as Channel[];
  }

  const channelMap = new Map(channels.map((c) => [c.channel_id, c]));
  const scoreMap = new Map(
    ((scores ?? []) as ChannelScore[]).map((s) => [s.channel_id, s])
  );

  const sortedChannels = channelIds
    .map((id) => channelMap.get(id))
    .filter((c): c is Channel => c !== undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Pipeline</h1>
          <p className="text-sm text-muted-foreground">
            {sortedChannels.length} channels ingested and scored
          </p>
        </div>
      </div>

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

      {sortedChannels.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <h2 className="text-lg font-medium">No channels yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Import channels via the Import page or POST to /api/admin/channels
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {sortedChannels.map((channel) => {
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
      )}
    </div>
  );
}
