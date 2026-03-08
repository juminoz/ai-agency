"use client";

import { Button } from "@repo/ui/components/button";
import { useCallback, useState } from "react";

type AnalysisType = "comment_sentiment" | "authenticity" | "interest_graph";

interface BulkAnalyzeResults {
  summary: { total: number; succeeded: number; failed: number };
  results: {
    channelId: string;
    success: boolean;
    completed: string[];
    error?: string;
  }[];
  message?: string;
}

const ANALYSIS_OPTIONS: { value: AnalysisType; label: string; description: string; cost: string }[] = [
  {
    value: "authenticity",
    label: "Authenticity Check",
    description: "Detect fake engagement patterns (view spikes, spam comments, abnormal like ratios)",
    cost: "Free",
  },
  {
    value: "comment_sentiment",
    label: "Comment Sentiment",
    description: "AI-powered analysis of comment demographics, purchase intent, and audience fit",
    cost: "Gemini API",
  },
  {
    value: "interest_graph",
    label: "Interest Graph",
    description: "Build a topic/interest map from video content and comments",
    cost: "Gemini API",
  },
];

export function BulkAnalyzer() {
  const [selected, setSelected] = useState<Set<AnalysisType>>(new Set(["authenticity"]));
  const [brandContext, setBrandContext] = useState("");
  const [mode, setMode] = useState<"unanalyzed" | "all">("unanalyzed");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BulkAnalyzeResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleAnalysis = useCallback((type: AnalysisType) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (selected.size === 0) {
      setError("Select at least one analysis type");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/admin/analyze/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: Array.from(selected),
          mode,
          brandContext: brandContext.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Analysis failed");
        setLoading(false);
        return;
      }

      setResults(data as BulkAnalyzeResults);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selected, mode, brandContext]);

  const usesGemini = selected.has("comment_sentiment") || selected.has("interest_graph");

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div>
        <h3 className="text-lg font-semibold">Bulk AI Analysis</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Run AI-powered analyses on ingested channels. Authenticity is free;
          sentiment and interest graph use Gemini API.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Analysis Types</label>
        <div className="space-y-2">
          {ANALYSIS_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors hover:bg-accent/50"
            >
              <input
                checked={selected.has(opt.value)}
                className="mt-0.5"
                type="checkbox"
                onChange={() => toggleAnalysis(opt.value)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{opt.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      opt.cost === "Free"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                    }`}
                  >
                    {opt.cost}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {opt.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {selected.has("comment_sentiment") && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Brand Context (optional)
          </label>
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="e.g. Language learning app for Japanese learners"
            value={brandContext}
            onChange={(e) => setBrandContext(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Helps the AI evaluate audience fit for your specific brand
          </p>
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            checked={mode === "unanalyzed"}
            name="analyzeMode"
            type="radio"
            value="unanalyzed"
            onChange={() => setMode("unanalyzed")}
          />
          Unanalyzed only
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            checked={mode === "all"}
            name="analyzeMode"
            type="radio"
            value="all"
            onChange={() => setMode("all")}
          />
          Re-analyze all
        </label>
      </div>

      {usesGemini && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          Gemini API calls will be made for each channel. This may take a while
          and consume API quota.
        </div>
      )}

      <Button
        className="w-full"
        disabled={loading || selected.size === 0}
        onClick={handleAnalyze}
      >
        {loading
          ? "Analyzing..."
          : `Analyze ${mode === "all" ? "All" : "Unanalyzed"} Channels`}
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
                  Succeeded: <strong>{results.summary.succeeded}</strong>
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
                    {r.completed.length > 0 && (
                      <span className="ml-2 text-green-700">
                        {r.completed.join(", ")}
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
