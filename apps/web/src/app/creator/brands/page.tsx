import { BrandDiscoveryClient } from "./brands-client";

import { requireRole } from "@/lib/auth/session";
import { getBrands, getBriefs, getCreatorByUserId, getDeals } from "@/lib/data";

function computeMatchScore(
  brandInterests: string[],
  creatorCategories: string[],
  creatorTags: string[],
  creatorAudienceInterests: { category: string; confidence: number }[]
): number {
  const creatorTerms = [
    ...creatorCategories.map((c) => c.toLowerCase()),
    ...creatorTags.map((t) => t.toLowerCase()),
    ...creatorAudienceInterests.map((a) => a.category.toLowerCase()),
  ];
  const overlap = brandInterests.filter((bi) =>
    creatorTerms.some(
      (ct) => ct.includes(bi.toLowerCase()) || bi.toLowerCase().includes(ct)
    )
  ).length;
  const base = Math.round((overlap / Math.max(brandInterests.length, 1)) * 100);
  return Math.min(98, Math.max(45, base + 40));
}

export default async function CreatorBrandsPage() {
  const session = await requireRole("creator");
  const creator = await getCreatorByUserId(session.id);

  if (!creator) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <p className="text-sm text-gray-500">
          Please{" "}
          <a className="text-brand-primary underline" href="/creator/profile">
            set up your profile
          </a>{" "}
          first to see brand opportunities.
        </p>
      </div>
    );
  }

  const [allBrands, allBriefs, existingDeals] = await Promise.all([
    getBrands(),
    getBriefs(),
    getDeals({ creatorId: creator.id }),
  ]);

  if (allBrands.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Brand Opportunities
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            No brands on the platform yet. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  // Track which brands already have active deals
  const brandIdsWithDeals = new Set(
    existingDeals
      .filter((d) => !["declined", "cancelled"].includes(d.status))
      .map((d) => d.brand_id)
  );

  const brandsWithScores = allBrands
    .map((brand) => {
      const brandBriefs = allBriefs.filter(
        (b) => b.brand_id === brand.id && b.status === "active"
      );
      return {
        ...brand,
        matchScore: computeMatchScore(
          brand.target_interests,
          creator.categories,
          creator.niche_tags,
          creator.audience_interests ?? []
        ),
        activeBriefs: brandBriefs,
        hasExistingDeal: brandIdsWithDeals.has(brand.id),
      };
    })
    .filter(
      (b) =>
        !creator.brand_preferences_blocked.some((blocked) =>
          (b.category ?? "").toLowerCase().includes(blocked)
        )
    )
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <BrandDiscoveryClient
      brands={brandsWithScores}
      creatorName={creator.name}
    />
  );
}
