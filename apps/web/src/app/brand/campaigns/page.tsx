import { Clock, Megaphone, Plus, Users } from "lucide-react";
import Link from "next/link";

import { requireRole } from "@/lib/auth/session";
import { getBrandByUserId, getBriefs, getDeals } from "@/lib/data";

function formatBudget(min: number, max: number): string {
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;
  return `${fmt(min)} – ${fmt(max)}`;
}

export default async function BrandCampaignsPage() {
  const session = await requireRole("brand");
  const brand = await getBrandByUserId(session.id);

  if (!brand) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <p className="text-sm text-gray-500">
          Please{" "}
          <a href="/brand/settings" className="text-brand-primary underline">
            set up your brand
          </a>{" "}
          first.
        </p>
      </div>
    );
  }

  const [briefs, brandDeals] = await Promise.all([
    getBriefs(brand.id),
    getDeals({ brandId: brand.id }),
  ]);

  const activeBriefs = briefs.filter((b) => b.status === "active");
  const draftBriefs = briefs.filter((b) => b.status === "draft");
  const completedBriefs = briefs.filter(
    (b) => b.status === "completed" || b.status === "paused" || b.status === "cancelled",
  );

  const sections = [
    { title: "Active Campaigns", items: activeBriefs, emptyText: "No active campaigns" },
    { title: "Drafts", items: draftBriefs, emptyText: "No drafts" },
    { title: "Past Campaigns", items: completedBriefs, emptyText: "No past campaigns" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Campaigns</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your campaign briefs and track creator engagement.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-button bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-500">
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
            {section.title}
            <span className="ml-2 text-gray-300">({section.items.length})</span>
          </h3>

          {section.items.length === 0 ? (
            <div className="rounded-card bg-white p-8 text-center shadow-card">
              <p className="text-sm text-gray-400">{section.emptyText}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((brief) => {
                const matchedCreators = brandDeals.filter(
                  (d) => d.brief_title === brief.title,
                ).length;

                return (
                  <div
                    key={brief.id}
                    className="rounded-card bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Megaphone className="h-4 w-4 text-brand-primary" />
                        <h4 className="text-sm font-semibold text-gray-800">
                          {brief.title}
                        </h4>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          brief.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : brief.status === "draft"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-surface-100 text-gray-500"
                        }`}
                      >
                        {brief.status.charAt(0).toUpperCase() + brief.status.slice(1)}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-xs text-gray-500">
                      {brief.description}
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">
                          {formatBudget(brief.budget_min, brief.budget_max)}
                        </span>
                        <span className="text-gray-300">·</span>
                        <span className="capitalize">{brief.goal}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          {brief.timeline}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-gray-400" />
                          {matchedCreators} creator{matchedCreators !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        href="/brand/deals"
                        className="flex-1 rounded-button border border-surface-200 bg-white px-3 py-2 text-center text-xs font-medium text-gray-600 transition-colors hover:bg-surface-50"
                      >
                        View Deals
                      </Link>
                      <Link
                        href="/brand/search"
                        className="flex-1 rounded-button bg-brand-primary px-3 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-brand-500"
                      >
                        Find Creators
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
