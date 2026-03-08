"use client";

import { useState } from "react";

import { DealCard } from "@/components/deal-card";
import { MessageThread } from "@/components/message-thread";
import dealsData from "@/data/mock/deals.json";

type Deal = (typeof dealsData)[number];

/* ------------------------------------------------------------------ */
/*  Filter helpers                                                     */
/* ------------------------------------------------------------------ */

type FilterTab = "all" | "received" | "active" | "completed";

const TAB_FILTERS: Record<FilterTab, (d: Deal) => boolean> = {
  all: () => true,
  received: (d) => d.status === "received",
  active: (d) => ["negotiating", "agreed", "live"].includes(d.status),
  completed: (d) => ["completed", "reviewed"].includes(d.status),
};

function tabCount(tab: FilterTab, deals: Deal[]): number {
  return deals.filter(TAB_FILTERS[tab]).length;
}

/* ------------------------------------------------------------------ */
/*  Status badge colors                                                */
/* ------------------------------------------------------------------ */

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  received: { bg: "bg-blue-100", text: "text-blue-600", label: "Received" },
  negotiating: { bg: "bg-amber-100", text: "text-amber-600", label: "Negotiating" },
  agreed: { bg: "bg-green-100", text: "text-green-600", label: "Agreed" },
  live: { bg: "bg-purple-100", text: "text-purple-600", label: "Live" },
  completed: { bg: "bg-gray-100", text: "text-gray-600", label: "Completed" },
  reviewed: { bg: "bg-accent-100", text: "text-accent-primary", label: "Reviewed" },
};

/* ------------------------------------------------------------------ */
/*  Performance card                                                   */
/* ------------------------------------------------------------------ */

function PerformanceCard({ performance }: { performance: NonNullable<Deal["performance"]> }) {
  const viewPct = Math.round(
    ((performance.actualViews - performance.projectedViews) / performance.projectedViews) * 100
  );
  const engPct = Math.round(
    ((performance.actualEngagements - performance.projectedEngagements) /
      performance.projectedEngagements) *
      100
  );

  return (
    <div className="rounded-card bg-surface-50 p-4">
      <h4 className="mb-3 text-sm font-semibold text-gray-700">Campaign Performance</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Views</p>
          <p className="text-lg font-bold text-gray-800">
            {performance.actualViews.toLocaleString()}
          </p>
          <p className={`text-xs font-medium ${viewPct >= 0 ? "text-green-600" : "text-red-500"}`}>
            {viewPct >= 0 ? "+" : ""}
            {viewPct}% vs projected
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Engagements</p>
          <p className="text-lg font-bold text-gray-800">
            {performance.actualEngagements.toLocaleString()}
          </p>
          <p className={`text-xs font-medium ${engPct >= 0 ? "text-green-600" : "text-red-500"}`}>
            {engPct >= 0 ? "+" : ""}
            {engPct}% vs projected
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-gray-500">{performance.daysLive} days live</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            performance.status === "above_target"
              ? "bg-green-100 text-green-600"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          {performance.status === "above_target" ? "Above Target" : "On Target"}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Review card                                                        */
/* ------------------------------------------------------------------ */

function ReviewCard({ review }: { review: NonNullable<Deal["review"]> }) {
  return (
    <div className="rounded-card bg-surface-50 p-4">
      <h4 className="mb-3 text-sm font-semibold text-gray-700">Reviews</h4>
      <div className="space-y-3">
        <div>
          <p className="mb-1 text-xs font-medium text-gray-500">Your Review</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-gray-700">
              {review.brandReview.overall}/5
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-xs text-gray-500">
              Delivery {review.brandReview.delivery}/5
            </span>
            <span className="text-xs text-gray-500">
              Comms {review.brandReview.communication}/5
            </span>
          </div>
          <p className="mt-1 text-xs italic text-gray-500">
            &ldquo;{review.brandReview.note}&rdquo;
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-gray-500">Creator Review</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-gray-700">
              {review.creatorReview.overall}/5
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-xs text-gray-500">
              Delivery {review.creatorReview.delivery}/5
            </span>
            <span className="text-xs text-gray-500">
              Comms {review.creatorReview.communication}/5
            </span>
          </div>
          <p className="mt-1 text-xs italic text-gray-500">
            &ldquo;{review.creatorReview.note}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Deal detail panel (brand perspective)                              */
/* ------------------------------------------------------------------ */

function DealDetail({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  const statusStyle = STATUS_STYLES[deal.status] ?? STATUS_STYLES.received;
  const budgetDisplay =
    deal.brief.budget.min === deal.brief.budget.max
      ? `$${deal.brief.budget.min.toLocaleString()}`
      : `$${deal.brief.budget.min.toLocaleString()} - $${deal.brief.budget.max.toLocaleString()}`;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-100 text-sm font-bold text-brand-primary">
            {deal.creatorName.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">{deal.brief.title}</h3>
            <p className="text-xs text-gray-500">{deal.creatorName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
          >
            {statusStyle.label}
          </span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Brief details */}
        <div className="mb-5 rounded-card bg-surface-50 p-4">
          <h4 className="mb-3 text-sm font-semibold text-gray-700">Brief Details</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500">Format</p>
              <p className="font-medium text-gray-700">{deal.brief.format}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Timeline</p>
              <p className="font-medium text-gray-700">{deal.brief.timeline}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Budget</p>
              <p className="font-medium text-gray-700">{budgetDisplay}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Goal</p>
              <p className="font-medium capitalize text-gray-700">{deal.brief.goal}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Deliverables</p>
              <p className="font-medium text-gray-700">{deal.brief.deliverables}</p>
            </div>
            {deal.brief.exclusivity && (
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Exclusivity</p>
                <p className="font-medium text-gray-700">
                  {deal.brief.exclusivity.category} &mdash; {deal.brief.exclusivity.window}
                </p>
              </div>
            )}
          </div>
          {deal.agreedRate && (
            <div className="mt-3 border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-500">Agreed Rate</p>
              <p className="text-lg font-bold text-green-600">
                ${deal.agreedRate.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Campaign URL */}
        {deal.campaignUrl && (
          <div className="mb-5">
            <p className="mb-1 text-xs text-gray-500">Campaign URL</p>
            <a
              href={deal.campaignUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-primary underline hover:text-brand-600"
            >
              {deal.campaignUrl}
            </a>
          </div>
        )}

        {/* Performance */}
        {deal.performance && (
          <div className="mb-5">
            <PerformanceCard performance={deal.performance} />
          </div>
        )}

        {/* Review */}
        {deal.review && (
          <div className="mb-5">
            <ReviewCard review={deal.review} />
          </div>
        )}

        {/* Action buttons — Brand perspective */}
        {deal.status === "negotiating" && (
          <div className="mb-5 flex gap-2">
            <button className="flex-1 rounded-button bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-500">
              Accept
            </button>
            <button className="flex-1 rounded-button border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100">
              Counter
            </button>
            <button className="flex-1 rounded-button border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
              Decline
            </button>
          </div>
        )}

        {deal.status === "agreed" && (
          <div className="mb-5 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Campaign URL</label>
              <input
                type="url"
                placeholder="https://..."
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
            </div>
            <button className="w-full rounded-button bg-purple-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-600">
              Mark as Live
            </button>
          </div>
        )}

        {/* Messages */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-700">Messages</h4>
          <MessageThread messages={deal.messages} currentUserType="brand" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function BrandDealsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  const filteredDeals = dealsData.filter(TAB_FILTERS[activeTab]);
  const selectedDeal = dealsData.find((d) => d.id === selectedDealId) ?? null;

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "received", label: "Received" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Filter tabs */}
      <div className="flex gap-1 rounded-card bg-white p-1 shadow-card">
        {tabs.map((tab) => {
          const count = tabCount(tab.key, dealsData);
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSelectedDealId(null);
              }}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-primary text-white"
                  : "text-gray-500 hover:bg-surface-100 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content area */}
      <div className="flex min-h-0 flex-1 gap-4">
        {/* Deal list */}
        <div
          className={`flex flex-col gap-3 overflow-y-auto ${
            selectedDeal ? "w-2/5" : "w-full"
          } transition-all`}
        >
          {filteredDeals.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-card bg-white p-12 shadow-card">
              <p className="text-sm text-gray-400">No deals in this category</p>
            </div>
          ) : (
            filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal as Deal}
                viewAs="brand"
                isSelected={selectedDealId === deal.id}
                onSelect={setSelectedDealId}
              />
            ))
          )}
        </div>

        {/* Detail panel */}
        {selectedDeal && (
          <div className="w-3/5">
            <DealDetail
              deal={selectedDeal}
              onClose={() => setSelectedDealId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
