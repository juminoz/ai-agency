import Link from "next/link";

import brandsData from "@/data/mock/brands.json";
import creatorsData from "@/data/mock/creators.json";

const creator = creatorsData.find((c) => c.id === "creator-1")!;

function computeMatchScore(brand: (typeof brandsData)[number]): number {
  const creatorTags = [
    ...creator.categories.map((c) => c.toLowerCase()),
    ...creator.nicheTags.map((t) => t.toLowerCase()),
    ...creator.audienceInterests.map((a) => a.category.toLowerCase()),
  ];
  const brandInterests = brand.targetAudience.interests.map((i) =>
    i.toLowerCase(),
  );
  const overlap = brandInterests.filter((bi) =>
    creatorTags.some((ct) => ct.includes(bi) || bi.includes(ct)),
  ).length;
  const base = Math.round((overlap / Math.max(brandInterests.length, 1)) * 100);
  return Math.min(98, Math.max(45, base + 40));
}

const brandsWithScores = brandsData
  .map((brand) => ({ ...brand, matchScore: computeMatchScore(brand) }))
  .filter(
    (b) =>
      !creator.brandPreferences.blocked.some((blocked) =>
        b.category.toLowerCase().includes(blocked),
      ),
  )
  .sort((a, b) => b.matchScore - a.matchScore);

function formatBudget(min: number, max: number): string {
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;
  return `${fmt(min)} – ${fmt(max)}`;
}

export default function CreatorBrandsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Brand Opportunities
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Brands ranked by how well their audience targets match your profile.
          {" "}
          <span className="font-medium text-brand-primary">
            {brandsWithScores.length} brands
          </span>{" "}
          match your categories.
        </p>
      </div>

      {/* Brand cards */}
      <div className="space-y-4">
        {brandsWithScores.map((brand, idx) => (
          <div
            key={brand.id}
            className="group rounded-card bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
          >
            <div className="flex items-start justify-between">
              {/* Left: brand info */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-100 text-2xl font-bold text-brand-primary">
                  {brand.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {brand.name}
                    </h3>
                    {idx === 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                        🔥 HIGH MATCH
                      </span>
                    )}
                    {idx > 0 && idx < 3 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-semibold text-accent-400">
                        ⭐ Suggested
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {brand.category} · {brand.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {brand.targetAudience.interests.map((interest) => (
                      <span
                        key={interest}
                        className="rounded-full bg-surface-100 px-2.5 py-0.5 text-xs text-gray-600"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: match score */}
              <div className="text-right">
                <div className="text-2xl font-bold text-brand-primary">
                  {brand.matchScore}%
                </div>
                <div className="text-xs text-gray-500">Audience Match</div>
              </div>
            </div>

            {/* Active briefs */}
            {brand.activeBriefs.length > 0 && (
              <div className="mt-4 border-t border-surface-200 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Active Opportunities
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {brand.activeBriefs.map((brief) => (
                    <div
                      key={brief.id}
                      className="rounded-xl border border-surface-200 bg-surface-50 p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {brief.title}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {brief.goal} · {brief.timeline}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {formatBudget(brief.budget.min, brief.budget.max)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        {brief.contentFormat.map((fmt) => (
                          <span
                            key={fmt}
                            className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-500"
                          >
                            {fmt}
                          </span>
                        ))}
                        <span className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-500">
                          📺 {brief.platform}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-gray-400">
                {brand.completedDeals} completed deals on Brand Buddy
              </div>
              <div className="flex gap-2">
                <Link
                  href="#"
                  className="rounded-button border border-surface-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-surface-50"
                >
                  View Details
                </Link>
                <button className="rounded-button bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500">
                  Signal Interest
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
