import Image from "next/image";
import { notFound } from "next/navigation";

import { AuthenticityBadge } from "@/components/authenticity-badge";
import { InterestGraph } from "@/components/interest-graph";
import { ScoreBreakdown } from "@/components/score-breakdown";
import { createServerClient } from "@/lib/supabase/server";
import {
  type Channel,
  type ChannelScore,
  type Interest,
  type Video,
} from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ channelId: string }>;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default async function ChannelDetailPage({ params }: PageProps) {
  const { channelId } = await params;
  const supabase = createServerClient();

  const { data: channel } = await supabase
    .from("channels")
    .select("*")
    .eq("channel_id", channelId)
    .single();

  if (!channel) notFound();

  const typedChannel = channel as Channel;

  const [scoresResult, interestsResult, videosResult, analysesResult] =
    await Promise.all([
      supabase
        .from("channel_scores")
        .select("*")
        .eq("channel_id", channelId)
        .single(),
      supabase
        .from("interest_profiles")
        .select("*")
        .eq("channel_id", channelId)
        .single(),
      supabase
        .from("videos")
        .select("*")
        .eq("channel_id", channelId)
        .order("published_at", { ascending: false })
        .limit(20),
      supabase
        .from("ai_analyses")
        .select("*")
        .eq("channel_id", channelId)
        .eq("analysis_type", "authenticity")
        .order("analyzed_at", { ascending: false })
        .limit(1),
    ]);

  const scores = scoresResult.data as ChannelScore | null;
  const interests =
    (interestsResult.data as { interests: Interest[] } | null)?.interests ?? [];
  const videos = (videosResult.data ?? []) as Video[];
  const authAnalysis = analysesResult.data?.[0] as
    | { result: { score: number; riskLevel: "low" | "medium" | "high" } }
    | undefined;

  return (
    <div className="space-y-8">
      {/* Channel Header */}
      <div className="flex items-start gap-6">
        {typedChannel.thumbnail_url && (
          <Image
            alt={typedChannel.title}
            className="h-24 w-24 rounded-full"
            height={96}
            src={typedChannel.thumbnail_url}
            width={96}
          />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold">{typedChannel.title}</h1>
          {typedChannel.custom_url && (
            <a
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              href={`https://youtube.com/${typedChannel.custom_url}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              youtube.com/{typedChannel.custom_url}
            </a>
          )}
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {typedChannel.description || "No description"}
          </p>
          <div className="mt-3 flex gap-6 text-sm">
            <div>
              <span className="font-semibold">
                {formatNumber(typedChannel.subscriber_count)}
              </span>{" "}
              <span className="text-muted-foreground">subscribers</span>
            </div>
            <div>
              <span className="font-semibold">
                {formatNumber(typedChannel.video_count)}
              </span>{" "}
              <span className="text-muted-foreground">videos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Authenticity Badge */}
      {authAnalysis && (
        <AuthenticityBadge
          riskLevel={authAnalysis.result.riskLevel}
          score={authAnalysis.result.score}
        />
      )}

      {/* Score Breakdown */}
      {scores ? (
        <div className="rounded-lg border p-6">
          <ScoreBreakdown
            audienceMatchScore={scores.audience_match_score}
            authenticityScore={scores.authenticity_score}
            consistencyScore={scores.consistency_score}
            engagementScore={scores.engagement_score}
            overallScore={scores.overall_score}
            topicRelevance={scores.topic_relevance}
            viewsScore={scores.views_score}
          />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          Not scored yet. POST to /api/admin/scores/{channelId} with keywords to
          generate scores.
        </div>
      )}

      {/* Interest Graph */}
      <div className="rounded-lg border p-6">
        <InterestGraph interests={interests} />
      </div>

      {/* Recent Videos */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">
          Recent Videos ({videos.length})
        </h3>
        <div className="space-y-2">
          {videos.map((video) => (
            <div
              key={video.video_id}
              className="flex items-center justify-between rounded-md border px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <a
                  className="font-medium hover:underline"
                  href={`https://youtube.com/watch?v=${video.video_id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {video.title}
                </a>
                <p className="text-xs text-muted-foreground">
                  {video.published_at
                    ? new Date(video.published_at).toLocaleDateString()
                    : "Unknown date"}
                </p>
              </div>
              <div className="flex gap-4 text-right text-xs text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">
                    {formatNumber(video.view_count)}
                  </p>
                  <p>views</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {formatNumber(video.like_count)}
                  </p>
                  <p>likes</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {formatNumber(video.comment_count)}
                  </p>
                  <p>comments</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
