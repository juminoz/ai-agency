"use client";

import { useState, useMemo } from "react";

import creators from "@/data/mock/creators.json";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function getTier(subs: number): string {
  if (subs >= 5_000_000) return "Mega";
  if (subs >= 1_000_000) return "Macro";
  if (subs >= 100_000) return "Mid";
  if (subs >= 10_000) return "Micro";
  return "Nano";
}

function scoreBadgeColor(score: number): string {
  if (score >= 85) return "bg-green-100 text-green-800";
  if (score >= 70) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

export default function AdminCreatorsPage() {
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [minScore, setMinScore] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(100);

  const filtered = useMemo(() => {
    return creators.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.categories.some((cat) => cat.toLowerCase().includes(search.toLowerCase()));
      const matchesPlatform = platformFilter === "all" || c.platform === platformFilter;
      const tier = getTier(c.subscriberCount);
      const matchesTier = tierFilter === "all" || tier.toLowerCase() === tierFilter.toLowerCase();
      const matchesScore = c.score.overall >= minScore && c.score.overall <= maxScore;
      return matchesSearch && matchesPlatform && matchesTier && matchesScore;
    });
  }, [search, platformFilter, tierFilter, minScore, maxScore]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-card bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          {/* Search */}
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-500">Search</label>
            <input
              type="text"
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          {/* Platform */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Platform</label>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-800 outline-none focus:border-brand-primary"
            >
              <option value="all">All Platforms</option>
              <option value="youtube">YouTube</option>
              <option value="twitch">Twitch</option>
            </select>
          </div>

          {/* Tier */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Tier</label>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-800 outline-none focus:border-brand-primary"
            >
              <option value="all">All Tiers</option>
              <option value="nano">Nano (1K-10K)</option>
              <option value="micro">Micro (10K-100K)</option>
              <option value="mid">Mid (100K-500K)</option>
              <option value="macro">Macro (1M-5M)</option>
              <option value="mega">Mega (5M+)</option>
            </select>
          </div>

          {/* Score Range */}
          <div className="flex gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Min Score</label>
              <input
                type="number"
                min={0}
                max={100}
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Max Score</label>
              <input
                type="number"
                min={0}
                max={100}
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
                className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">{filtered.length} creator{filtered.length !== 1 ? "s" : ""} found</p>

      {/* Table */}
      <div className="rounded-card bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-4 py-4 font-medium">Platform</th>
                <th className="px-4 py-4 font-medium">Subscribers</th>
                <th className="px-4 py-4 font-medium">Score</th>
                <th className="px-4 py-4 font-medium">Categories</th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-4 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((creator) => (
                <tr key={creator.id} className="border-b border-gray-50 hover:bg-surface-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{creator.name}</p>
                      <p className="text-xs text-gray-400">@{creator.handle}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      creator.platform === "youtube" ? "bg-red-100 text-red-800" : "bg-purple-100 text-purple-800"
                    }`}>
                      {creator.platform}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{formatNumber(creator.subscriberCount)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${scoreBadgeColor(creator.score.overall)}`}>
                      {creator.score.overall}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {creator.categories.slice(0, 2).map((cat) => (
                        <span key={cat} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          {cat}
                        </span>
                      ))}
                      {creator.categories.length > 2 && (
                        <span className="text-xs text-gray-400">+{creator.categories.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      creator.availabilityStatus === "open"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {creator.availabilityStatus === "open" ? "Active" : "Limited"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1.5">
                      <button className="rounded-button border border-brand-primary px-3 py-1 text-xs font-medium text-brand-primary hover:bg-brand-50">
                        View Profile
                      </button>
                      <button className="rounded-button border border-orange-300 px-3 py-1 text-xs font-medium text-orange-700 hover:bg-orange-50">
                        Suspend
                      </button>
                      <button className="rounded-button border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50">
                        Flag
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-gray-500">No creators match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
