"use client";

import { useState, useMemo } from "react";

import { CreatorCard } from "@/components/creator-card";

interface Creator {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  bio: string;
  platform: string;
  isOnPlatform?: boolean;
  subscriberCount: number;
  videoCount: number;
  categories: string[];
  nicheTags: string[];
  availabilityStatus: string;
  minimumDealSize: number;
  brandPreferences: { open: string[]; blocked: string[] };
  publicProfileUrl: string;
  channelUrl: string;
  score: {
    overall: number;
    topicRelevance: number;
    recentViews: number;
    engagementHealth: number;
    authenticity: number;
    activityConsistency: number;
    commentAudienceMatch: number;
  };
  nicheRanking: { percentile: number; category: string; tier: string };
  performanceTrend: {
    viewsTrend: string;
    engagementTrend: string;
    narrative: string;
  };
  audienceInterests: { category: string; confidence: number }[];
  authenticity: {
    score: number;
    fakeFollowerRisk: string;
    viewSpikeDetected: boolean;
    commentQuality: number;
    likeToViewNormality: number;
  };
  recentVideos: {
    id: string;
    title: string;
    publishedAt: string;
    views: number;
    likes: number;
    comments: number;
    engagementRate: number;
  }[];
  trackRecord: {
    completedCampaigns: number;
    deliveryRate: number;
    avgPerformanceVsProjection: string;
    avgRating: number;
  };
  dealHistory: {
    brand: string;
    rate: number;
    format: string;
    date: string;
    outcome: string;
  }[];
}

interface CreatorSearchProps {
  creators: Creator[];
}

const BUDGET_RANGES = [
  { label: "Any Budget", min: 0, max: Infinity },
  { label: "Under $500", min: 0, max: 500 },
  { label: "$500 - $1,000", min: 500, max: 1000 },
  { label: "$1,000 - $3,000", min: 1000, max: 3000 },
  { label: "$3,000+", min: 3000, max: Infinity },
];

export function CreatorSearch({ creators }: CreatorSearchProps) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all");
  const [budgetIdx, setBudgetIdx] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchMode, setSearchMode] = useState<"search" | "campaign">("search");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const budget = BUDGET_RANGES[budgetIdx]!;

    return creators.filter((c) => {
      // Platform status filter
      if (statusFilter === "on_platform" && !c.isOnPlatform) return false;
      if (statusFilter === "channel_only" && c.isOnPlatform) return false;

      // Platform filter
      if (platform !== "all" && c.platform !== platform) return false;

      // Budget filter
      if (c.minimumDealSize < budget.min || c.minimumDealSize > budget.max) {
        // Check if creator's minimum deal size falls outside the range
        // We want creators whose minimumDealSize is within the budget
        if (c.minimumDealSize > budget.max) return false;
      }

      // Search query filter
      if (q) {
        const haystack = [
          c.name,
          ...c.categories,
          ...c.nicheTags,
          c.bio,
          ...c.audienceInterests.map((i) => i.category),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      }

      return true;
    });
  }, [creators, query, platform, budgetIdx, statusFilter]);

  return (
    <div>
      {/* Search bar area */}
      <div className="rounded-card bg-white p-5 shadow-card">
        {/* Mode toggle */}
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={() => setSearchMode("search")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              searchMode === "search"
                ? "bg-brand-primary text-white"
                : "bg-surface-100 text-gray-600 hover:bg-surface-200"
            }`}
          >
            Search
          </button>
          <button
            onClick={() => setSearchMode("campaign")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              searchMode === "campaign"
                ? "bg-brand-primary text-white"
                : "bg-surface-100 text-gray-600 hover:bg-surface-200"
            }`}
          >
            Describe Campaign
          </button>
        </div>

        {/* Search / Campaign input */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            {searchMode === "search" ? (
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by niche, topic, or describe your campaign..."
                  className="w-full rounded-xl border border-surface-200 bg-surface-50 py-3 pl-12 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:border-brand-primary focus:ring-2 focus:ring-brand-100"
                />
              </div>
            ) : (
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your campaign... e.g. 'We're launching a new smart home speaker and need tech reviewers who create honest, detailed reviews for an audience aged 18-34...'"
                rows={3}
                className="w-full rounded-xl border border-surface-200 bg-amber-50 py-3 px-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:border-accent-primary focus:ring-2 focus:ring-accent-100"
              />
            )}
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Platform dropdown */}
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="rounded-full border border-surface-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-primary"
            >
              <option value="all">All Platforms</option>
              <option value="youtube">YouTube</option>
              <option value="twitch">Twitch</option>
            </select>

            {/* Budget dropdown */}
            <select
              value={budgetIdx}
              onChange={(e) => setBudgetIdx(Number(e.target.value))}
              className="rounded-full border border-surface-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-primary"
            >
              {BUDGET_RANGES.map((r, i) => (
                <option key={i} value={i}>
                  {r.label}
                </option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-full border border-surface-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-primary"
            >
              <option value="all">All Creators</option>
              <option value="on_platform">On Platform</option>
              <option value="channel_only">Channel Only</option>
            </select>

            {/* Search button */}
            <button className="rounded-button bg-brand-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-500">
              Search Creators
            </button>
          </div>
        </div>
      </div>

      {/* Results header */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          {query.trim()
            ? `Recommended Creators for "${query.trim()}"`
            : "All Creators"}
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({filtered.length} result{filtered.length !== 1 ? "s" : ""})
          </span>
        </h2>
      </div>

      {/* Creator grid */}
      {filtered.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-card bg-white p-12 shadow-card">
          <svg
            className="h-12 w-12 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="mt-3 text-sm text-gray-500">
            No creators match your search. Try adjusting your filters.
          </p>
        </div>
      )}

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-surface-200 bg-white px-4 py-3 shadow-nav md:left-[250px]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-2">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Quick search..."
              className="w-full max-w-xs bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-button border border-surface-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-surface-50">
              Details
            </button>
            <button className="rounded-button bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600">
              Create Shortlist
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for bottom bar */}
      <div className="h-16" />
    </div>
  );
}
