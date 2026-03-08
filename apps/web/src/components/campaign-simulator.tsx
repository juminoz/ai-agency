"use client";

import { Button } from "@repo/ui/components/button";
import { useCallback, useState } from "react";

interface SimulationResult {
  totalReach: number;
  expectedEngagements: number;
  estimatedConversions: { low: number; mid: number; high: number };
  costPerConversion: { low: number; mid: number; high: number };
  costEfficiency: "high" | "medium" | "low";
  perChannel: {
    channelId: string;
    channelTitle: string;
    medianViews: number;
    projectedReach: number;
    projectedEngagements: number;
  }[];
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatCurrency(n: number): string {
  if (!isFinite(n)) return "N/A";
  return `$${n.toFixed(2)}`;
}

const EFFICIENCY_STYLES = {
  high: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  low: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function CampaignSimulator() {
  const [channelIds, setChannelIds] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const ids = channelIds
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean);

      if (ids.length === 0) {
        setError("Enter at least one channel ID");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/admin/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelIds: ids,
          budget: parseFloat(budget) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Simulation failed");
        setLoading(false);
        return;
      }

      setResult(data.simulation as SimulationResult);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [channelIds, budget]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Channel IDs (one per line)
          </label>
          <textarea
            className="h-28 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
            placeholder={"UCzwPKK7dTlO2W21g122MNkQ\nUC_x5XG1OV2P6uZZ5FSM9Ttw"}
            value={channelIds}
            onChange={(e) => setChannelIds(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Campaign Budget ($)</label>
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="5000"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <Button className="w-full" disabled={loading} onClick={handleSimulate}>
          {loading ? "Simulating..." : "Run Simulation"}
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Total Reach</p>
              <p className="text-xl font-bold">
                {formatNumber(result.totalReach)}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Engagements</p>
              <p className="text-xl font-bold">
                {formatNumber(result.expectedEngagements)}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Conversions (mid)</p>
              <p className="text-xl font-bold">
                {formatNumber(result.estimatedConversions.mid)}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Efficiency</p>
              <p className="text-xl font-bold">
                <span
                  className={`rounded-full px-2 py-0.5 text-sm ${EFFICIENCY_STYLES[result.costEfficiency]}`}
                >
                  {result.costEfficiency}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h4 className="mb-2 text-sm font-medium">Conversion Estimates</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Low (1%)</p>
                <p className="font-medium">{result.estimatedConversions.low}</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(result.costPerConversion.low)}/conv
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Mid (2%)</p>
                <p className="font-medium">{result.estimatedConversions.mid}</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(result.costPerConversion.mid)}/conv
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">High (3%)</p>
                <p className="font-medium">
                  {result.estimatedConversions.high}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(result.costPerConversion.high)}/conv
                </p>
              </div>
            </div>
          </div>

          {result.perChannel.length > 0 && (
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 text-sm font-medium">Per Channel</h4>
              <div className="space-y-2 text-sm">
                {result.perChannel.map((ch) => (
                  <div
                    key={ch.channelId}
                    className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
                  >
                    <span className="font-medium">{ch.channelTitle}</span>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Reach: {formatNumber(ch.projectedReach)}</span>
                      <span>Eng: {formatNumber(ch.projectedEngagements)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
