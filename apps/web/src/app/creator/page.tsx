import { Flame, Play } from "lucide-react";

import { BrandMatchCard } from "@/components/brand-match-card";
import { ScoreGauge } from "@/components/score-gauge";
import { requireRole } from "@/lib/auth/session";
import { getBrands, getBriefs, getCreatorByUserId, getCreatorVideos } from "@/lib/data";
import { type CreatorProfile } from "@/lib/supabase/types";

function computeMatchScore(
  brandInterests: string[],
  creatorCategories: string[],
  creatorTags: string[],
): number {
  const creatorTerms = [
    ...creatorCategories.map((c) => c.toLowerCase()),
    ...creatorTags.map((t) => t.toLowerCase()),
  ];
  let hits = 0;
  for (const interest of brandInterests) {
    if (creatorTerms.some((t) => t.includes(interest.toLowerCase()) || interest.toLowerCase().includes(t))) {
      hits++;
    }
  }
  const base = Math.round((hits / Math.max(brandInterests.length, 1)) * 100);
  return Math.min(98, Math.max(45, base + 40));
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export default async function CreatorDashboardPage() {
  const session = await requireRole("creator");
  const creator = await getCreatorByUserId(session.id);

  // No profile yet — prompt to create one
  if (!creator) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="rounded-card bg-white p-12 text-center shadow-card">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {session.fullName || "Creator"}!
          </h2>
          <p className="mt-3 max-w-md text-sm text-gray-500">
            Set up your creator profile so brands can discover you and send deal requests.
          </p>
          <a
            className="mt-6 inline-flex items-center gap-2 rounded-button bg-brand-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-500"
            href="/creator/profile"
          >
            Create Your Profile
          </a>
        </div>
      </div>
    );
  }

  const [allBrands, allBriefs, recentVideos] = await Promise.all([
    getBrands(),
    getBriefs(),
    getCreatorVideos(creator.id),
  ]);

  const brandMatches = allBrands
    .map((brand) => {
      const brandBriefs = allBriefs.filter((b) => b.brand_id === brand.id && b.status === "active");
      return {
        brand,
        briefs: brandBriefs,
        matchScore: computeMatchScore(
          brand.target_interests,
          creator.categories,
          creator.niche_tags,
        ),
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  const topMatch = brandMatches[0];
  const suggestedMatches = brandMatches.slice(1, 4);
  const greeting = getGreeting();
  const topInterests = (creator.audience_interests ?? []).slice(0, 5);
  const topVideos = recentVideos.slice(0, 3);

  return (
    <div className="min-h-screen bg-surface-50 p-6 lg:p-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        {greeting}, {creator.name.split(" ")[0]}{" "}
      </h1>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ScoreCard creator={creator} />

        {/* Audience Snapshot */}
        <div className="rounded-card bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Audience Snapshot
          </h3>
          {topInterests.length > 0 ? (
            <div className="space-y-3">
              {topInterests.map((interest) => (
                <div key={interest.category}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-700">{interest.category}</span>
                    <span className="font-medium text-gray-800">
                      {Math.round(interest.confidence * 100)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-brand-primary"
                      style={{
                        width: `${Math.round(interest.confidence * 100)}%`,
                        opacity: 0.6 + interest.confidence * 0.4,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No audience data yet</p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="rounded-card bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Channel Stats
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Subscribers</span>
              <span className="text-sm font-bold text-gray-800">
                {formatCount(creator.subscriber_count)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Videos</span>
              <span className="text-sm font-bold text-gray-800">
                {creator.video_count}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completed Campaigns</span>
              <span className="text-sm font-bold text-gray-800">
                {creator.completed_campaigns}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Delivery Rate</span>
              <span className="text-sm font-bold text-gray-800">
                {creator.delivery_rate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Matches + Performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-card bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Brand Matches For You
            </h3>
            {topMatch && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold uppercase text-red-500">
                <Flame className="h-3 w-3" /> High Match
              </span>
            )}
          </div>

          {brandMatches.length === 0 ? (
            <p className="text-sm text-gray-400">
              No brands on the platform yet. Check back soon!
            </p>
          ) : (
            <>
              {topMatch && topMatch.briefs[0] && (
                <div className="mb-6">
                  <BrandMatchCard
                    featured
                    briefTitle={topMatch.briefs[0].title}
                    budget={{ min: topMatch.briefs[0].budget_min, max: topMatch.briefs[0].budget_max }}
                    category={topMatch.brand.category ?? ""}
                    logo={topMatch.brand.logo ?? ""}
                    matchScore={topMatch.matchScore}
                    name={topMatch.brand.name}
                    timeline={topMatch.briefs[0].timeline ?? ""}
                  />
                </div>
              )}

              {suggestedMatches.filter((m) => m.briefs[0]).length > 0 && (
                <>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Suggested Opportunities
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {suggestedMatches
                      .filter((m) => m.briefs[0])
                      .map(({ brand, briefs: brandBriefs, matchScore }) => (
                        <BrandMatchCard
                          key={brand.id}
                          briefTitle={brandBriefs[0].title}
                          budget={{ min: brandBriefs[0].budget_min, max: brandBriefs[0].budget_max }}
                          category={brand.category ?? ""}
                          logo={brand.logo ?? ""}
                          matchScore={matchScore}
                          name={brand.name}
                          timeline={brandBriefs[0].timeline ?? ""}
                        />
                      ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Performance */}
        <div className="rounded-card bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Performance
          </h3>

          {creator.views_trend && (
            <div className="mb-4 rounded-xl bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">
                  {creator.views_trend}
                </span>
                <span className="text-sm text-green-700">in views</span>
              </div>
              {creator.engagement_trend && (
                <p className="mt-1 text-xs text-green-600">
                  Engagement {creator.engagement_trend}
                </p>
              )}
            </div>
          )}

          {topVideos.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase text-gray-400">Top Recent Videos</p>
              <div className="space-y-3">
                {topVideos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-start gap-3 rounded-xl bg-surface-50 p-3 transition-colors hover:bg-surface-100"
                  >
                    <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-brand-100">
                      <Play className="h-4 w-4 text-brand-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-medium text-gray-700">
                        {video.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                        <span>{formatCount(video.views)} views</span>
                        <span>·</span>
                        <span>{video.engagement_rate}% eng</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!creator.views_trend && topVideos.length === 0 && (
            <p className="text-sm text-gray-400">No performance data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ creator }: { creator: CreatorProfile }) {
  return (
    <div className="flex flex-col items-center justify-between rounded-card bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
      <ScoreGauge score={creator.score_overall} />

      {creator.niche_percentile > 0 && (
        <p className="mt-3 text-center text-sm text-gray-600">
          Top{" "}
          <span className="font-semibold text-brand-primary">
            {creator.niche_percentile}%
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">{creator.niche_category}</span>{" "}
          Creators
        </p>
      )}
      {creator.niche_tier && (
        <p className="mb-4 text-xs text-gray-400">{creator.niche_tier}</p>
      )}

      <div className="mb-4 w-full space-y-1.5">
        {[
          { label: "Topic Relevance", value: creator.score_topic_relevance },
          { label: "Engagement", value: creator.score_engagement_health },
          { label: "Authenticity", value: creator.score_authenticity },
          { label: "Consistency", value: creator.score_activity_consistency },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs">
            <span className="w-24 text-gray-500">{item.label}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-brand-primary"
                style={{ width: `${item.value}%` }}
              />
            </div>
            <span className="w-6 text-right font-medium text-gray-600">{item.value}</span>
          </div>
        ))}
      </div>

      <a
        className="w-full rounded-button bg-brand-primary px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-brand-500"
        href="/creator/profile"
      >
        Edit My Profile
      </a>
    </div>
  );
}
