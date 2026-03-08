import Link from "next/link";

import creatorsData from "@/data/mock/creators.json";

// Mock shortlists — in production these would come from the database
const shortlists = [
  {
    id: "sl-1",
    name: "Tokyo Campaign — Travel Creators",
    createdAt: "2026-03-02",
    creatorIds: ["creator-1", "creator-5", "creator-7"],
    briefId: "brief-4",
  },
  {
    id: "sl-2",
    name: "Tech Product Launch Q1",
    createdAt: "2026-02-15",
    creatorIds: ["creator-2", "creator-8"],
    briefId: "brief-1",
  },
  {
    id: "sl-3",
    name: "Fitness Micro-Influencers",
    createdAt: "2026-01-28",
    creatorIds: ["creator-4"],
    briefId: "brief-3",
  },
];

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export default function BrandShortlistsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Your Shortlists
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {shortlists.length} saved shortlists
          </p>
        </div>
        <Link
          className="rounded-button bg-brand-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-500"
          href="/brand/search"
        >
          + New Shortlist
        </Link>
      </div>

      {/* Shortlist cards */}
      <div className="space-y-4">
        {shortlists.map((list) => {
          const creators = list.creatorIds
            .map((id) => creatorsData.find((c) => c.id === id))
            .filter(Boolean) as (typeof creatorsData)[number][];

          const totalReach = creators.reduce((sum, c) => {
            const avgViews =
              c.recentVideos.reduce((s, v) => s + v.views, 0) /
              c.recentVideos.length;
            return sum + avgViews;
          }, 0);

          const avgScore =
            creators.reduce((sum, c) => sum + c.score.overall, 0) /
            creators.length;

          return (
            <div
              key={list.id}
              className="rounded-card bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {list.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Created {list.createdAt} · {creators.length} creator
                    {creators.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-button border border-surface-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-surface-50">
                    Export PDF
                  </button>
                  <button className="rounded-button border border-surface-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-surface-50">
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 flex gap-6">
                <div>
                  <p className="text-xs text-gray-400">Combined Reach</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {formatNumber(Math.round(totalReach))}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Avg Score</p>
                  <p className="text-lg font-semibold text-brand-primary">
                    {Math.round(avgScore)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Creators</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {creators.length}
                  </p>
                </div>
              </div>

              {/* Creator row */}
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {creators.map((c) => (
                  <Link
                    key={c.id}
                    className="flex min-w-[200px] items-center gap-3 rounded-xl border border-surface-200 bg-surface-50 p-3 transition-colors hover:bg-surface-100"
                    href={`/brand/creators/${c.id}`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {c.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Score: {c.score.overall} ·{" "}
                        {formatNumber(c.subscriberCount)} subs
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center justify-between border-t border-surface-200 pt-4">
                <button className="text-sm font-medium text-red-500 hover:text-red-600">
                  Delete Shortlist
                </button>
                <button className="rounded-button bg-brand-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500">
                  Send Deal Proposals
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
