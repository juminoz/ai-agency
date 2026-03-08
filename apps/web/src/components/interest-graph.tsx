interface InterestGraphProps {
  interests: {
    category: string;
    confidence: number;
  }[];
}

export function InterestGraph({ interests }: InterestGraphProps) {
  if (interests.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No interest data available. Run AI analysis to generate.
      </div>
    );
  }

  const sorted = [...interests].sort((a, b) => b.confidence - a.confidence);
  const maxConfidence = sorted[0]?.confidence ?? 1;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Audience Interests</h3>
      <div className="space-y-2">
        {sorted.map((interest) => {
          const pct = Math.round((interest.confidence / maxConfidence) * 100);
          return (
            <div key={interest.category} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{interest.category}</span>
                <span className="text-muted-foreground">
                  {Math.round(interest.confidence * 100)}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
