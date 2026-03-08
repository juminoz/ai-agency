import { BarChart3, Handshake } from "lucide-react";
import Link from "next/link";

import { requireRole } from "@/lib/auth/session";
import { getBrandByUserId, getBriefs, getDeals } from "@/lib/data";

export default async function BrandDashboardPage() {
  const session = await requireRole("brand");
  const brand = await getBrandByUserId(session.id);

  // No brand profile yet — prompt to create one
  if (!brand) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="rounded-card bg-white p-12 text-center shadow-card">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {session.fullName || "Brand"}!
          </h2>
          <p className="mt-3 max-w-md text-sm text-gray-500">
            Set up your brand profile to start finding creators and launching campaigns.
          </p>
          <a
            href="/brand/settings"
            className="mt-6 inline-flex items-center gap-2 rounded-button bg-brand-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-500"
          >
            Set Up Your Brand
          </a>
        </div>
      </div>
    );
  }

  const [briefs, brandDeals] = await Promise.all([
    getBriefs(brand.id),
    getDeals({ brandId: brand.id }),
  ]);

  const totalBriefs = briefs.filter((b) => b.status === "active").length;
  const creatorsContacted = brandDeals.length;
  const avgMatchScore = brandDeals.length > 0
    ? Math.round(brandDeals.reduce((sum, d) => sum + (d.match_score ?? 0), 0) / brandDeals.length)
    : 0;
  const budgetSpent = brandDeals
    .filter((d) => d.agreed_rate !== null)
    .reduce((sum, d) => sum + (d.agreed_rate ?? 0), 0);

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
      value: avgMatchScore > 0 ? avgMatchScore.toString() : "—",
      icon: (
        <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: "Budget Spent",
      value: budgetSpent > 0 ? `$${budgetSpent.toLocaleString()}` : "$0",
      icon: (
        <svg className="h-5 w-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {brand.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s what&apos;s happening with your campaigns today.
        </p>
      </div>

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Active Briefs
          </h2>
          {briefs.filter((b) => b.status === "active").length === 0 ? (
            <div className="rounded-card bg-white p-8 text-center shadow-card">
              <p className="text-sm text-gray-400">No active briefs yet</p>
              <Link
                href="/brand/campaigns"
                className="mt-4 inline-flex rounded-button bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
              >
                Create a Campaign
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {briefs.filter((b) => b.status === "active").map((brief) => {
                const matchedCreators = brandDeals.filter(
                  (d) => d.brief_title === brief.title,
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
                      <span>
                        ${brief.budget_min.toLocaleString()} - ${brief.budget_max.toLocaleString()}
                      </span>
                      <span className="capitalize">{brief.platform}</span>
                      <span>{matchedCreators} matched</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/brand/search"
              className="flex items-center gap-3 rounded-card bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                <svg className="h-5 w-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Find Creators</p>
                <p className="text-xs text-gray-500">Search for the perfect match</p>
              </div>
            </Link>
            <Link
              href="/brand/campaigns"
              className="flex items-center gap-3 rounded-card bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50">
                <BarChart3 className="h-5 w-5 text-accent-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Manage Campaigns</p>
                <p className="text-xs text-gray-500">View and manage your briefs</p>
              </div>
            </Link>
            <Link
              href="/brand/deals"
              className="flex items-center gap-3 rounded-card bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                <Handshake className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">View Deals</p>
                <p className="text-xs text-gray-500">Track your ongoing deals</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
