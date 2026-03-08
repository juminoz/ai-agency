"use client";

import { Button } from "@repo/ui/components/button";
import { useCallback, useState } from "react";

interface CsvUploaderProps {
  onUploadComplete?: (results: ImportResults) => void;
}

interface ImportResults {
  summary: { total: number; succeeded: number; failed: number };
  results: {
    channelId: string;
    title: string;
    success: boolean;
    error?: string;
  }[];
}

export function CsvUploader({ onUploadComplete }: CsvUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ImportResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFile(e.target.files?.[0] ?? null);
      setError(null);
      setResults(null);
    },
    []
  );

  const handleUpload = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let response: Response;

      if (file) {
        const text = await file.text();
        response = await fetch("/api/admin/channels/import", {
          method: "POST",
          headers: { "Content-Type": "text/csv" },
          body: text,
        });
      } else if (jsonInput.trim()) {
        const channels = jsonInput
          .split(/[\n,]/)
          .map((s) => s.trim())
          .filter(Boolean);

        response = await fetch("/api/admin/channels/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channels }),
        });
      } else {
        setError("Provide a CSV file or paste channel IDs");
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Import failed");
        setLoading(false);
        return;
      }

      setResults(data as ImportResults);
      onUploadComplete?.(data as ImportResults);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [file, jsonInput, onUploadComplete]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Upload CSV</label>
        <div className="flex items-center gap-2">
          <input
            accept=".csv"
            className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          CSV with column: channel_id, handle, or id
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Paste Channel IDs (one per line)
        </label>
        <textarea
          className="h-32 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
          placeholder={
            "UCzwPKK7dTlO2W21g122MNkQ\n@ashleyrosepeters\nUC_x5XG1OV2P6uZZ5FSM9Ttw"
          }
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value);
            setError(null);
            setResults(null);
          }}
        />
      </div>

      <Button className="w-full" disabled={loading} onClick={handleUpload}>
        {loading ? "Importing..." : "Import Channels"}
      </Button>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      {results && (
        <div className="space-y-2 rounded-md border p-4">
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
                <span className="font-medium">{r.title || r.channelId}</span>
                {r.error && (
                  <span className="ml-2 text-red-600">{r.error}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
