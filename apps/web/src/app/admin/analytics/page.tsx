import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface CountResult {
  count: number | null;
}

export default async function AnalyticsPage() {
  const supabase = createServerClient();

  const [channelsResult, videosResult, commentsResult, scoresResult, analysesResult] =
    await Promise.all([
      supabase.from("channels").select("*", { count: "exact", head: true }),
      supabase.from("videos").select("*", { count: "exact", head: true }),
      supabase.from("comments").select("*", { count: "exact", head: true }),
      supabase.from("channel_scores").select("*", { count: "exact", head: true }),
      supabase.from("ai_analyses").select("*", { count: "exact", head: true }),
    ]);

  const stats = [
    { label: "Channels", value: (channelsResult as CountResult).count ?? 0 },
    { label: "Videos", value: (videosResult as CountResult).count ?? 0 },
    { label: "Comments", value: (commentsResult as CountResult).count ?? 0 },
    { label: "Scored Channels", value: (scoresResult as CountResult).count ?? 0 },
    { label: "AI Analyses", value: (analysesResult as CountResult).count ?? 0 },
  ];

  const unscoredCount =
    ((channelsResult as CountResult).count ?? 0) -
    ((scoresResult as CountResult).count ?? 0);

  // Recent channels
  const { data: recentChannels } = await supabase
    .from("channels")
    .select("channel_id, title, subscriber_count, fetched_at")
    .order("fetched_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Platform Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of ingested data and pipeline activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border p-4 text-center"
          >
            <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Unscored alert */}
      {unscoredCount > 0 && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm dark:border-yellow-800 dark:bg-yellow-950">
          <strong>{unscoredCount}</strong> channel{unscoredCount > 1 ? "s" : ""}{" "}
          ingested but not yet scored. Use the scoring API to generate scores.
        </div>
      )}

      {/* Recent Ingestions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Ingestions</h2>
        {(recentChannels ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No channels ingested yet.</p>
        ) : (
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left font-medium">Channel</th>
                  <th className="px-4 py-2 text-right font-medium">Subscribers</th>
                  <th className="px-4 py-2 text-right font-medium">Fetched</th>
                </tr>
              </thead>
              <tbody>
                {(recentChannels ?? []).map((ch) => (
                  <tr key={ch.channel_id} className="border-b last:border-0">
                    <td className="px-4 py-2 font-medium">{ch.title}</td>
                    <td className="px-4 py-2 text-right text-muted-foreground">
                      {(ch.subscriber_count as number).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right text-muted-foreground">
                      {new Date(ch.fetched_at as string).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
