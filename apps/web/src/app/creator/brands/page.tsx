import { Flame, Monitor, Star } from "lucide-react";
import Link from "next/link";

import { getBrands, getBriefs, getCreatorById } from "@/lib/data";

const CREATOR_ID = "creator-1";

function computeMatchScore(
  brandInterests: string[],
  creatorCategories: string[],
  creatorTags: string[],
  creatorAudienceInterests: { category: string; confidence: number }[],
): number {
  const creatorTerms = [
    ...creatorCategories.map((c) => c.toLowerCase()),
    ...creatorTags.map((t) => t.toLowerCase()),
    ...creatorAudienceInterests.map((a) => a.category.toLowerCase()),
  ];
  const overlap = brandInterests.filter((bi) =>
    creatorTerms.some((ct) => ct.includes(bi.toLowerCase()) || bi.toLowerCase().includes(ct)),
  ).length;
  const base = Math.round((overlap / Math.max(brandInterests.length, 1)) * 100);
  return Math.min(98, Math.max(45, base + 40));
}

function formatBudget(min: number, max: number): string {
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;
  return `${fmt(min)} – ${fmt(max)}`;
}

export default async function CreatorBrandsPage() {
  const [creator, allBrands, allBriefs] = await Promise.all([
    getCreatorById(CREATOR_ID),
    getBrands(),
    getBriefs(),
  ]);

  if (!creator) {
    return <p className="p-8 text-gray-500">Creator not found.</p>;
  }

  const brandsWithScores = allBrands
    .map((brand) => {
      const brandBriefs = allBriefs.filter((b) => b.brand_id === brand.id && b.status === "active");
      return {
        ...brand,
        matchScore: computeMatchScore(
          brand.target_interests,
          creator.categories,
          creator.niche_tags,
          creator.audience_interests,
        ),
        activeBriefs: brandBriefs,
      };
    })
    .filter(
      (b) =>
        !creator.brand_preferences_blocked.some((blocked) =>
          (b.category ?? "").toLowerCase().includes(blocked),
        ),
    )
    .sort((a, b) => b.matchScore - a.matchScore);

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
                        <Flame className="h-3 w-3" /> HIGH MATCH
                      </span>
                    )}
                    {idx > 0 && idx < 3 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-semibold text-accent-400">
                        <Star className="h-3 w-3" /> Suggested
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {brand.category} · {brand.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {brand.target_interests.map((interest) => (
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
                          {formatBudget(brief.budget_min, brief.budget_max)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        {brief.content_formats.map((fmt) => (
                          <span
                            key={fmt}
                            className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-500"
                          >
                            {fmt}
                          </span>
                        ))}
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs text-gray-500">
                          <Monitor className="h-3 w-3" /> {brief.platform}
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
                {brand.completed_deals} completed deals on Brand Buddy
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
