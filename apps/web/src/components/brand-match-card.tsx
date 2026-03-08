interface BrandMatchCardProps {
  name: string;
  logo: string;
  category: string;
  matchScore: number;
  budget: { min: number; max: number };
  briefTitle: string;
  timeline: string;
  featured?: boolean;
}

export function BrandMatchCard({
  name,
  logo: _logo,
  category,
  matchScore,
  budget,
  briefTitle,
  timeline,
  featured = false,
}: BrandMatchCardProps) {
  const matchColor =
    matchScore >= 85
      ? "text-green-600 bg-green-50"
      : matchScore >= 70
        ? "text-amber-600 bg-amber-50"
        : "text-gray-600 bg-gray-50";

  if (featured) {
    return (
      <div className="group rounded-card border-2 border-brand-100 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-lg font-bold text-brand-primary">
              {name.charAt(0)}
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{name}</h4>
              <p className="text-xs text-gray-500">{category}</p>
            </div>
          </div>
          <div className={`rounded-full px-3 py-1 text-sm font-semibold ${matchColor}`}>
            {matchScore}% match
          </div>
        </div>
        <p className="mb-3 text-sm text-gray-700">{briefTitle}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Budget: ${budget.min.toLocaleString()} &ndash; ${budget.max.toLocaleString()}
          </span>
          <span>{timeline}</span>
        </div>
        <button className="mt-4 w-full rounded-button bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500">
          View Opportunity
        </button>
      </div>
    );
  }

  return (
    <div className="group rounded-card bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-100 text-sm font-bold text-brand-primary">
          {name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-gray-800">{name}</h4>
          <p className="text-xs text-gray-500">{category}</p>
        </div>
        <div className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${matchColor}`}>
          {matchScore}%
        </div>
      </div>
      <p className="mb-2 line-clamp-2 text-xs text-gray-600">{briefTitle}</p>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Up to ${budget.max.toLocaleString()}</span>
        <span>{timeline}</span>
      </div>
    </div>
  );
}
