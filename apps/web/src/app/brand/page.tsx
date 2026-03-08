import Link from "next/link";

import brands from "@/data/mock/brands.json";
import deals from "@/data/mock/deals.json";

// Use NovaTech (brand-1) as the logged-in brand
const brand = brands.find((b) => b.id === "brand-1")!;

// Derive stats from mock data
const brandDeals = deals.filter((d) => d.brandId === brand.id);
const totalBriefs = brand.activeBriefs.length;
const creatorsContacted = brandDeals.length;
const avgMatchScore = 89; // Mock value — NovaTech's match w/ Marcus is 89
const budgetSpent = brandDeals
  .filter((d) => d.agreedRate !== null)
  .reduce((sum, d) => sum + (d.agreedRate ?? 0), 0);

// Recent activity feed (inline mock)
const recentActivity = [
  {
    id: "a1",
    icon: "📨",
    text: "Deal request sent to Marcus Chen for Smart Speaker Launch",
    time: "2 days ago",
  },
  {
    id: "a2",
    icon: "💬",
    text: "Marcus Chen viewed your campaign brief",
    time: "2 days ago",
  },
  {
    id: "a3",
    icon: "✅",
    text: "Previous campaign with Maya Rodriguez completed — +32% vs projection",
    time: "5 days ago",
  },
  {
    id: "a4",
    icon: "📊",
    text: "Home Automation Series brief published — awaiting creator matches",
    time: "1 week ago",
  },
  {
    id: "a5",
    icon: "🤝",
    text: "Deal with Marcus Chen completed for RTX 5080 review — delivered on time",
    time: "3 weeks ago",
  },
];

const stats = [
  {
    label: "Active Campaigns",
    value: totalBriefs.toString(),
    icon: (
      <svg className="h-5 w-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
  {
    label: "Creators Contacted",
    value: creatorsContacted.toString(),
    icon: (
      <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Avg Match Score",
    value: avgMatchScore.toString(),
    icon: (
      <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    label: "Budget Spent",
    value: `$${budgetSpent.toLocaleString()}`,
    icon: (
      <svg className="h-5 w-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function BrandDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {brand.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s what&apos;s happening with your campaigns today.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-card bg-white p-5 shadow-card"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-100">
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Briefs + Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Briefs */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Active Briefs
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {brand.activeBriefs.map((brief) => {
              // Count matching deals for this brief
              const matchedCreators = brandDeals.filter(
                (d) => d.brief.title === brief.title
              ).length;

              return (
                <div
                  key={brief.id}
                  className="rounded-card bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {brief.title}
                    </h3>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      Active
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-gray-500">
                    {brief.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1" />
                      </svg>
                      ${brief.budget.min.toLocaleString()} - ${brief.budget.max.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 capitalize">
                      <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {brief.platform}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {matchedCreators} matched
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Recent Activity
          </h2>
          <div className="rounded-card bg-white shadow-card">
            <ul className="divide-y divide-surface-100">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="flex gap-3 px-4 py-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-100 text-sm">
                    {activity.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-700">{activity.text}</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Search card */}
      <div className="rounded-card bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold text-gray-800">Quick Search</h2>
        <p className="mt-1 text-sm text-gray-500">
          Find the perfect creators for your next campaign.
        </p>
        <Link
          href="/brand/search"
          className="mt-4 inline-flex items-center gap-2 rounded-button bg-brand-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-500"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Creators
        </Link>
      </div>
    </div>
  );
}
