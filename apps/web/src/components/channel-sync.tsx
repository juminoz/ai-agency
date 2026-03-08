"use client";

import { useState } from "react";

export function ChannelSync() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    synced?: number;
    skipped?: number;
    total?: number;
    message?: string;
    errors?: string[];
  } | null>(null);

  async function handleSync() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/sync-channels", { method: "POST" });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ message: `Sync failed: ${err}` });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Sync Channels → Creator Profiles</h3>
          <p className="text-sm text-muted-foreground">
            Creates placeholder creator profiles for scored channels so brands
            can discover them. Channels without a user account are marked as
            &ldquo;Channel Only&rdquo;.
          </p>
        </div>
        <button
          disabled={loading}
          onClick={handleSync}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Syncing…" : "Sync Now"}
        </button>
      </div>

      {result && (
        <div className="mt-3 rounded-md bg-muted p-3 text-sm">
          <p>{result.message}</p>
          {result.synced !== undefined && (
            <p className="mt-1 text-muted-foreground">
              Synced: {result.synced} · Skipped: {result.skipped} · Total
              scored: {result.total}
            </p>
          )}
          {result.errors && result.errors.length > 0 && (
            <ul className="mt-2 list-disc pl-4 text-destructive">
              {result.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
