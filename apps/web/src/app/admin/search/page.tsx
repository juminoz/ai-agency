"use client";

import { Button } from "@repo/ui/components/button";
import { useCallback, useState } from "react";

import { ChannelCard } from "@/components/channel-card";

interface SearchResult {
  channel: {
    channel_id: string;
    title: string;
    description: string | null;
    subscriber_count: number;
    video_count: number;
    thumbnail_url: string | null;
  };
  scores: { overall_score: number };
  matchReason: string;
}

export default function SearchPage() {
  const [keywords, setKeywords] = useState("");
  const [minSubs, setMinSubs] = useState("");
  const [minScore, setMinScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const keywordList = keywords
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (keywordList.length === 0) {
        setError("Enter at least one keyword");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/admin/channels/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: keywordList,
          minSubscribers: minSubs ? parseInt(minSubs, 10) : undefined,
          minScore: minScore ? parseInt(minScore, 10) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Search failed");
        setLoading(false);
        return;
      }

      setResults(data.results as SearchResult[]);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [keywords, minSubs, minScore]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Brand Intent Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find influencers that match your brand&apos;s target audience and
          content niche.
        </p>
      </div>

      <div className="mx-auto max-w-xl space-y-4 rounded-lg border p-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Keywords (comma-separated)
          </label>
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="japan, travel, food, vlog"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Min Subscribers</label>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="5000"
              type="number"
              value={minSubs}
              onChange={(e) => setMinSubs(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Min Score</label>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="60"
              type="number"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
            />
          </div>
        </div>

        <Button className="w-full" disabled={loading} onClick={handleSearch}>
          {loading ? "Searching..." : "Search Channels"}
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-center text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Results ({results.length})</h2>
          <div className="grid gap-3">
            {results.map((r) => (
              <ChannelCard
                key={r.channel.channel_id}
                channelId={r.channel.channel_id}
                description={r.channel.description}
                matchReason={r.matchReason}
                overallScore={r.scores.overall_score}
                subscriberCount={r.channel.subscriber_count}
                thumbnailUrl={r.channel.thumbnail_url}
                title={r.channel.title}
                videoCount={r.channel.video_count}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
