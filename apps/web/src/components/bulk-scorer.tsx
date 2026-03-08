"use client";

import { Button } from "@repo/ui/components/button";
import { useCallback, useState } from "react";

interface BulkScoreResults {
  summary: { total: number; succeeded: number; failed: number };
  results: {
    channelId: string;
    success: boolean;
    overallScore?: number;
    error?: string;
  }[];
  message?: string;
}

export function BulkScorer() {
  const [keywords, setKeywords] = useState("");
  const [mode, setMode] = useState<"unscored" | "all">("unscored");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BulkScoreResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScore = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResults(null);

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

      const response = await fetch("/api/admin/scores/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: keywordList, mode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Scoring failed");
        setLoading(false);
        return;
      }

      setResults(data as BulkScoreResults);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [keywords, mode]);

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div>
        <h3 className="text-lg font-semibold">Bulk Scoring</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Score channels based on topic relevance keywords. Channels need
          ingested data (videos &amp; comments) to be scored.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Keywords (comma-separated)
        </label>
        <input
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="language learning, japanese, education, tutorial"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            checked={mode === "unscored"}
            name="scoreMode"
            type="radio"
            value="unscored"
            onChange={() => setMode("unscored")}
          />
          Unscored only
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            checked={mode === "all"}
            name="scoreMode"
            type="radio"
            value="all"
            onChange={() => setMode("all")}
          />
          Rescore all
        </label>
      </div>

      <Button className="w-full" disabled={loading} onClick={handleScore}>
        {loading ? "Scoring..." : `Score ${mode === "all" ? "All" : "Unscored"} Channels`}
      </Button>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      {results && (
        <div className="space-y-2 rounded-md border p-4">
          {results.message ? (
            <p className="text-sm text-muted-foreground">{results.message}</p>
          ) : (
            <>
              <div className="flex gap-4 text-sm">
                <span>
                  Total: <strong>{results.summary.total}</strong>
                </span>
                <span className="text-green-600">
                  Scored: <strong>{results.summary.succeeded}</strong>
                </span>
                <span className="text-red-600">
                  Failed: <strong>{results.summary.failed}</strong>
                </span>
              </div>
              <div className="max-h-48 space-y-1 overflow-y-auto text-xs">
                {results.results.map((r) => (
                  <div
                    key={r.channelId}
                    className={`rounded px-2 py-1 ${
                      r.success
                        ? "bg-green-50 dark:bg-green-950"
                        : "bg-red-50 dark:bg-red-950"
                    }`}
                  >
                    <span className="font-medium">{r.channelId}</span>
                    {r.overallScore !== undefined && (
                      <span className="ml-2 text-green-700">
                        Score: {r.overallScore}
                      </span>
                    )}
                    {r.error && (
                      <span className="ml-2 text-red-600">{r.error}</span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
