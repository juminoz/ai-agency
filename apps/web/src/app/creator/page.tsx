import { Flame, MapPin, Play } from "lucide-react";

import { BrandMatchCard } from "@/components/brand-match-card";
import { ScoreGauge } from "@/components/score-gauge";
import { getBrands, getBriefs, getCreatorById, getCreatorVideos } from "@/lib/data";
import { type CreatorProfile } from "@/lib/supabase/types";

const CREATOR_ID = "creator-1";

// Simple match scoring based on overlapping interests
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

// Determine greeting based on approximate time (server render default)
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Format subscriber count
function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

// Mock audience demographics
const audienceDemographics = {
  gender: { male: 42, female: 54, other: 4 },
  ageRanges: [
    { range: "18-24", pct: 34 },
    { range: "25-34", pct: 41 },
    { range: "35-44", pct: 16 },
    { range: "45+", pct: 9 },
  ],
  topLocation: { country: "United States", pct: 62 },
};

export default async function CreatorDashboardPage() {
  const [creator, allBrands, allBriefs, recentVideos] = await Promise.all([
    getCreatorById(CREATOR_ID),
    getBrands(),
    getBriefs(),
    getCreatorVideos(CREATOR_ID),
  ]);

  if (!creator) {
    return <p className="p-8 text-gray-500">Creator not found.</p>;
  }

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
  const topInterests = creator.audience_interests.slice(0, 5);
  const topVideos = recentVideos.slice(0, 3);

  return (
    <div className="min-h-screen bg-surface-50 p-6 lg:p-8">
      {/* Greeting */}
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        {greeting}, {creator.name.split(" ")[0]}{" "}
      </h1>

      {/* Row 1: Three cards */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Brand Buddy Score */}
        <ScoreCard creator={creator} />

        {/* Audience Snapshot */}
        <div className="rounded-card bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Audience Snapshot
          </h3>
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
          <button className="mt-5 w-full rounded-button border border-brand-primary px-4 py-2 text-sm font-medium text-brand-primary transition-colors hover:bg-brand-50">
            View Full Report
          </button>
        </div>

        {/* Audience Demographics */}
        <div className="rounded-card bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Audience Demographics
          </h3>

          {/* Donut chart (SVG) */}
          <div className="mb-4 flex items-center justify-center">
            <GenderDonut
              male={audienceDemographics.gender.male}
              female={audienceDemographics.gender.female}
              other={audienceDemographics.gender.other}
            />
          </div>

          {/* Legend */}
          <div className="mb-4 flex justify-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-primary" />
              Female {audienceDemographics.gender.female}%
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-primary" />
              Male {audienceDemographics.gender.male}%
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-300" />
              Other {audienceDemographics.gender.other}%
            </span>
          </div>

          {/* Age ranges */}
          <div className="mb-4 space-y-2">
            <p className="text-xs font-semibold uppercase text-gray-400">Age Ranges</p>
            {audienceDemographics.ageRanges.map((ar) => (
              <div key={ar.range} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{ar.range}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-brand-300"
                      style={{ width: `${ar.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-medium text-gray-700">
                    {ar.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Top location */}
          <div className="flex items-center gap-2 rounded-xl bg-surface-50 p-3">
            <MapPin className="h-5 w-5 text-brand-primary" />
            <div className="text-sm">
              <p className="font-medium text-gray-700">
                {audienceDemographics.topLocation.country}
              </p>
              <p className="text-xs text-gray-500">
                {audienceDemographics.topLocation.pct}% of audience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Brand Matches + Performance Trend */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Brand Matches — 2/3 width */}
        <div className="rounded-card bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Brand Matches For You
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold uppercase text-red-500">
              <Flame className="h-3 w-3" /> High Match
            </span>
          </div>

          {/* Featured brand */}
          {topMatch && topMatch.briefs[0] && (
            <div className="mb-6">
              <BrandMatchCard
                name={topMatch.brand.name}
                logo={topMatch.brand.logo ?? ""}
                category={topMatch.brand.category ?? ""}
                matchScore={topMatch.matchScore}
                budget={{ min: topMatch.briefs[0].budget_min, max: topMatch.briefs[0].budget_max }}
                briefTitle={topMatch.briefs[0].title}
                timeline={topMatch.briefs[0].timeline ?? ""}
                featured
              />
            </div>
          )}

          {/* Suggested Opportunities */}
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Suggested Opportunities
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedMatches
              .filter((m) => m.briefs[0])
              .map(({ brand, briefs: brandBriefs, matchScore }) => (
              <BrandMatchCard
                key={brand.id}
                name={brand.name}
                logo={brand.logo ?? ""}
                category={brand.category ?? ""}
                matchScore={matchScore}
                budget={{ min: brandBriefs[0].budget_min, max: brandBriefs[0].budget_max }}
                briefTitle={brandBriefs[0].title}
                timeline={brandBriefs[0].timeline ?? ""}
              />
            ))}
          </div>
        </div>

        {/* Performance Trend — 1/3 width */}
        <div className="rounded-card bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Performance Trend
          </h3>

          {/* Views callout */}
          <div className="mb-4 rounded-xl bg-green-50 p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">
                {creator.views_trend}
              </span>
              <span className="text-sm text-green-700">in views this quarter</span>
            </div>
            <p className="mt-1 text-xs text-green-600">
              Engagement {creator.engagement_trend}
            </p>
          </div>

          {/* Most engaging content type */}
          <div className="mb-4">
            <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
              Most Engaging Format
            </p>
            <p className="text-sm font-medium text-gray-700">Destination Guides</p>
            <p className="text-xs text-gray-500">Optimal length: 12-18 minutes</p>
          </div>

          {/* Top recent videos */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase text-gray-400">Top Recent Videos</p>
            <div className="space-y-3">
              {topVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-start gap-3 rounded-xl bg-surface-50 p-3 transition-colors hover:bg-surface-100"
                >
                  {/* Thumbnail placeholder */}
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
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Score Card sub-component
   ═══════════════════════════════════════════════════════ */
function ScoreCard({ creator }: { creator: CreatorProfile }) {
  return (
    <div className="flex flex-col items-center justify-between rounded-card bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
      <ScoreGauge score={creator.score_overall} />

      <p className="mt-3 text-center text-sm text-gray-600">
        Top{" "}
        <span className="font-semibold text-brand-primary">
          {creator.niche_percentile}%
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-800">{creator.niche_category}</span>{" "}
        Creators
      </p>
      <p className="mb-4 text-xs text-gray-400">{creator.niche_tier}</p>

      {/* Score breakdown mini */}
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

      <button className="w-full rounded-button bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-500">
        Share My Profile
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Gender Donut SVG (server-rendered)
   ═══════════════════════════════════════════════════════ */
function GenderDonut({
  male,
  female,
  other,
}: {
  male: number;
  female: number;
  other: number;
}) {
  const size = 120;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const femaleDash = (female / 100) * circumference;
  const maleDash = (male / 100) * circumference;
  const otherDash = (other / 100) * circumference;

  const femaleOffset = 0;
  const maleOffset = -(femaleDash);
  const otherOffset = -(femaleDash + maleDash);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
      {/* Female */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#4AADE5"
        strokeWidth={strokeWidth}
        strokeDasharray={`${femaleDash} ${circumference - femaleDash}`}
        strokeDashoffset={femaleOffset}
      />
      {/* Male */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#F5A623"
        strokeWidth={strokeWidth}
        strokeDasharray={`${maleDash} ${circumference - maleDash}`}
        strokeDashoffset={maleOffset}
      />
      {/* Other */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#D1D5DB"
        strokeWidth={strokeWidth}
        strokeDasharray={`${otherDash} ${circumference - otherDash}`}
        strokeDashoffset={otherOffset}
      />
    </svg>
  );
}
