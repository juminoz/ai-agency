"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";


import { startConversationAction } from "./actions";

import type {
  CreatorProfile,
  CreatorVideo,
  DealMessage,
} from "@/lib/supabase/types";

import { ScoreGauge } from "@/components/score-gauge";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

type SortKey =
  | "title"
  | "published_at"
  | "views"
  | "likes"
  | "comments"
  | "engagement_rate";
type SortDir = "asc" | "desc";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ScoreBar({
  label,
  score,
  weight,
}: {
  label: string;
  score: number;
  weight: string;
}) {
  const color =
    score >= 75
      ? "bg-emerald-500"
      : score >= 50
        ? "bg-amber-400"
        : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <div className="w-40 flex-shrink-0">
        <p className="text-sm text-gray-700">{label}</p>
        <p className="text-xs text-gray-400">{weight}</p>
      </div>
      <div className="flex-1">
        <div className="h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full ${color}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
      <span className="w-10 text-right text-sm font-semibold text-gray-800">
        {score}
      </span>
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const colorMap: Record<string, string> = {
    "very low": "bg-emerald-100 text-emerald-700",
    low: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${colorMap[level] || "bg-gray-100 text-gray-600"}`}
    >
      {level}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const partial = rating - full;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < full ? "text-amber-400" : i === full && partial > 0 ? "text-amber-300" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm font-semibold text-gray-700">{rating}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Message Composer                                                   */
/* ------------------------------------------------------------------ */

function MessageComposer({
  creatorId,
  existingMessages,
}: {
  creatorId: string;
  existingMessages: DealMessage[];
}) {
  const [showComposer, setShowComposer] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    startConversationAction,
    { sent: false }
  );

  if (existingMessages.length > 0) {
    return (
      <div className="rounded-card bg-white p-6 shadow-card">
        <h2 className="mb-4 border-b border-surface-100 pb-3 text-lg font-semibold text-gray-800">
          Messages
        </h2>
        <div className="space-y-3">
          {existingMessages.slice(-5).map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender_type === "brand" ? "items-end" : "items-start"}`}
            >
              <span className="mb-1 px-1 text-xs font-medium text-gray-500">
                {msg.sender_name ?? msg.sender_type}
              </span>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender_type === "brand"
                    ? "rounded-br-md bg-brand-primary text-white"
                    : "rounded-bl-md bg-surface-100 text-gray-700"
                }`}
              >
                {msg.text}
              </div>
              <span className="mt-1 px-1 text-[11px] text-gray-400">
                {new Date(msg.sent_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Link
            className="rounded-button bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
            href="/brand/messages"
          >
            View Full Conversation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-card bg-white p-6 shadow-card">
      <h2 className="mb-4 border-b border-surface-100 pb-3 text-lg font-semibold text-gray-800">
        Send a Message
      </h2>

      {state.sent ? (
        <div className="space-y-3">
          <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
            Message sent! The creator will see your message in their inbox.
          </div>
          <Link
            className="inline-block rounded-button bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
            href="/brand/messages"
          >
            Go to Messages
          </Link>
        </div>
      ) : !showComposer ? (
        <div className="text-center">
          <p className="mb-4 text-sm text-gray-500">
            Interested in working with this creator? Start a conversation.
          </p>
          <button
            className="rounded-button bg-brand-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-500"
            onClick={() => setShowComposer(true)}
          >
            Start Conversation
          </button>
        </div>
      ) : (
        <form ref={formRef} action={formAction} className="space-y-4">
          <input name="creatorId" type="hidden" value={creatorId} />
          <textarea
            required
            className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-200"
            name="text"
            placeholder="Hi! We'd love to work with you on..."
            rows={4}
          />
          {state.error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </div>
          )}
          <div className="flex gap-2">
            <button
              className="rounded-button bg-brand-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-50"
              disabled={isPending}
              type="submit"
            >
              {isPending ? "Sending..." : "Send Message"}
            </button>
            <button
              className="rounded-button border px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              type="button"
              onClick={() => setShowComposer(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function CreatorDetail({
  creator,
  videos,
  existingMessages,
}: {
  creator: CreatorProfile;
  videos: CreatorVideo[];
  existingMessages: DealMessage[];
}) {
  const [sortKey, setSortKey] = useState<SortKey>("published_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [budget, setBudget] = useState(3000);
  const [goal, setGoal] = useState("awareness");
  const [showProjection, setShowProjection] = useState(false);

  const avgViews =
    videos.length > 0
      ? Math.round(videos.reduce((sum, v) => sum + v.views, 0) / videos.length)
      : 0;
  const avgEngagement =
    videos.length > 0
      ? videos.reduce((sum, v) => sum + v.engagement_rate, 0) / videos.length
      : 0;

  const sortedVideos = [...videos].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDir === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return sortDir === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortHeader({ label, field }: { label: string; field: SortKey }) {
    const isActive = sortKey === field;
    return (
      <button
        className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-800"
        onClick={() => handleSort(field)}
      >
        {label}
        {isActive && (
          <svg
            className={`h-3 w-3 transition-transform ${sortDir === "asc" ? "rotate-180" : ""}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              fillRule="evenodd"
            />
          </svg>
        )}
      </button>
    );
  }

  const platformBadge =
    creator.platform === "youtube" ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
        </svg>
        YouTube
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
        </svg>
        Twitch
      </span>
    );

  // Projection calculations
  const minDeal = creator.minimum_deal_size || 1;
  const projections: Record<
    string,
    {
      reach: string;
      engagements: string;
      conversions: string;
      cpe: string;
      roi: string;
    }
  > = {
    awareness: {
      reach: `${formatNumber(Math.round(avgViews * (budget / minDeal) * 0.85))} - ${formatNumber(Math.round(avgViews * (budget / minDeal) * 1.15))}`,
      engagements: formatNumber(
        Math.round(avgViews * (avgEngagement / 100) * (budget / minDeal))
      ),
      conversions: `${formatNumber(Math.round(avgViews * 0.003 * (budget / minDeal)))} - ${formatNumber(Math.round(avgViews * 0.008 * (budget / minDeal)))}`,
      cpe:
        avgEngagement > 0
          ? `$${(budget / (avgViews * (avgEngagement / 100) * (budget / minDeal))).toFixed(2)}`
          : "N/A",
      roi: "8.4",
    },
    consideration: {
      reach: `${formatNumber(Math.round(avgViews * (budget / minDeal) * 0.7))} - ${formatNumber(Math.round(avgViews * (budget / minDeal) * 1.0))}`,
      engagements: formatNumber(
        Math.round(avgViews * (avgEngagement / 100) * (budget / minDeal) * 1.2)
      ),
      conversions: `${formatNumber(Math.round(avgViews * 0.005 * (budget / minDeal)))} - ${formatNumber(Math.round(avgViews * 0.012 * (budget / minDeal)))}`,
      cpe:
        avgEngagement > 0
          ? `$${(budget / (avgViews * (avgEngagement / 100) * (budget / minDeal) * 1.2)).toFixed(2)}`
          : "N/A",
      roi: "7.2",
    },
    conversion: {
      reach: `${formatNumber(Math.round(avgViews * (budget / minDeal) * 0.6))} - ${formatNumber(Math.round(avgViews * (budget / minDeal) * 0.85))}`,
      engagements: formatNumber(
        Math.round(avgViews * (avgEngagement / 100) * (budget / minDeal) * 0.9)
      ),
      conversions: `${formatNumber(Math.round(avgViews * 0.008 * (budget / minDeal)))} - ${formatNumber(Math.round(avgViews * 0.02 * (budget / minDeal)))}`,
      cpe:
        avgEngagement > 0
          ? `$${(budget / (avgViews * (avgEngagement / 100) * (budget / minDeal) * 0.9)).toFixed(2)}`
          : "N/A",
      roi: "6.1",
    },
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
        href="/brand/search"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M15 19l-7-7 7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
        Back to Search
      </Link>

      {/* ===== HEADER ===== */}
      <div className="rounded-card bg-white p-6 shadow-card">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-brand-primary text-xl font-bold text-white">
              {creator.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-800">
                  {creator.name}
                </h1>
                {platformBadge}
              </div>
              <p className="text-sm text-gray-500">@{creator.handle}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {creator.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-600"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <ScoreGauge score={creator.score_overall} size={100} />
              <p className="mt-1 text-xs font-medium text-gray-500">
                Top {creator.niche_percentile}% in{" "}
                {creator.niche_category ?? "their niche"}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span
                className={`rounded-full px-3 py-1 text-center text-xs font-medium ${
                  creator.availability_status === "open"
                    ? "bg-emerald-100 text-emerald-700"
                    : creator.availability_status === "limited"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {creator.availability_status === "open"
                  ? "Open to deals"
                  : creator.availability_status === "limited"
                    ? "Limited availability"
                    : "Not available"}
              </span>
              <span className="text-center text-xs text-gray-500">
                Min. ${formatNumber(creator.minimum_deal_size)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ROW 1: Score Breakdown + Authenticity ===== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-card bg-white p-6 shadow-card">
          <h2 className="mb-4 border-b border-surface-100 pb-3 text-lg font-semibold text-gray-800">
            Score Breakdown
          </h2>
          <div className="space-y-3">
            <ScoreBar
              label="Topic Relevance"
              score={creator.score_topic_relevance}
              weight="25% weight"
            />
            <ScoreBar
              label="Recent Views"
              score={creator.score_recent_views}
              weight="20% weight"
            />
            <ScoreBar
              label="Engagement Health"
              score={creator.score_engagement_health}
              weight="18% weight"
            />
            <ScoreBar
              label="Authenticity"
              score={creator.score_authenticity}
              weight="15% weight"
            />
            <ScoreBar
              label="Activity / Consistency"
              score={creator.score_activity_consistency}
              weight="12% weight"
            />
            <ScoreBar
              label="Comment-Audience Match"
              score={creator.score_comment_audience_match}
              weight="10% weight"
            />
          </div>
        </div>

        <div className="rounded-card bg-white p-6 shadow-card">
          <h2 className="mb-4 border-b border-surface-100 pb-3 text-lg font-semibold text-gray-800">
            Authenticity Report
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Overall Authenticity
              </span>
              <span className="text-2xl font-bold text-gray-800">
                {creator.authenticity_score}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Fake Follower Risk</span>
              <RiskBadge level={creator.fake_follower_risk} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">View Spike Detected</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  creator.view_spike_detected
                    ? "bg-red-100 text-red-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {creator.view_spike_detected ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Comment Quality</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${creator.comment_quality}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {creator.comment_quality}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Like-to-View Normality
              </span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${creator.like_to_view_normality}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {creator.like_to_view_normality}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ROW 2: Audience Interests + Message Composer ===== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-card bg-white p-6 shadow-card">
          <h2 className="mb-4 border-b border-surface-100 pb-3 text-lg font-semibold text-gray-800">
            Audience Interest Map
          </h2>
          {creator.audience_interests &&
          creator.audience_interests.length > 0 ? (
            <div className="space-y-3">
              {creator.audience_interests.map((interest) => (
                <div
                  key={interest.category}
                  className="flex items-center gap-3"
                >
                  <span className="w-36 flex-shrink-0 text-sm text-gray-700">
                    {interest.category}
                  </span>
                  <div className="flex-1">
                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-brand-primary"
                        style={{ width: `${interest.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-12 text-right text-sm font-semibold text-gray-800">
                    {Math.round(interest.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              No audience interest data available yet.
            </p>
          )}
        </div>

        {/* Message Composer */}
        <MessageComposer
          creatorId={creator.id}
          existingMessages={existingMessages}
        />
      </div>

      {/* ===== ROW 3: Performance ===== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-card bg-white p-6 shadow-card">
          <h2 className="mb-4 border-b border-surface-100 pb-3 text-lg font-semibold text-gray-800">
            Performance Trend
          </h2>
          {creator.trend_narrative && (
            <p className="mb-4 text-sm leading-relaxed text-gray-700">
              {creator.trend_narrative}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-surface-50 p-3">
              <p className="text-xs text-gray-500">Views Trend</p>
              <p className="text-lg font-bold text-emerald-600">
                {creator.views_trend ?? "N/A"}
              </p>
            </div>
            <div className="rounded-xl bg-surface-50 p-3">
              <p className="text-xs text-gray-500">Engagement Trend</p>
              <p className="text-lg font-bold text-emerald-600">
                {creator.engagement_trend ?? "N/A"}
              </p>
            </div>
            <div className="rounded-xl bg-surface-50 p-3">
              <p className="text-xs text-gray-500">Avg Views</p>
              <p className="text-lg font-bold text-gray-800">
                {formatNumber(avgViews)}
              </p>
            </div>
            <div className="rounded-xl bg-surface-50 p-3">
              <p className="text-xs text-gray-500">Avg Engagement</p>
              <p className="text-lg font-bold text-gray-800">
                {avgEngagement.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Track Record Summary */}
        <div className="rounded-card bg-white p-6 shadow-card">
          <h2 className="mb-4 border-b border-surface-100 pb-3 text-lg font-semibold text-gray-800">
            Track Record
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-surface-50 p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">
                {creator.completed_campaigns}
              </p>
              <p className="text-xs text-gray-500">Completed Campaigns</p>
            </div>
            <div className="rounded-xl bg-surface-50 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {creator.delivery_rate}%
              </p>
              <p className="text-xs text-gray-500">Delivery Rate</p>
            </div>
            <div className="rounded-xl bg-surface-50 p-4 text-center">
              <p className="text-2xl font-bold text-brand-primary">
                {creator.avg_performance_vs_projection ?? "N/A"}
              </p>
              <p className="text-xs text-gray-500">vs Projection</p>
            </div>
            <div className="rounded-xl bg-surface-50 p-4 text-center">
              <StarRating rating={creator.avg_rating} />
              <p className="mt-1 text-xs text-gray-500">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ROW 4: Recent Videos ===== */}
      {videos.length > 0 && (
        <div className="rounded-card bg-white p-6 shadow-card">
          <h2 className="mb-4 border-b border-surface-100 pb-3 text-lg font-semibold text-gray-800">
            Recent Videos
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100">
                  <th className="pb-3 text-left">
                    <SortHeader field="title" label="Title" />
                  </th>
                  <th className="pb-3 text-left">
                    <SortHeader field="published_at" label="Published" />
                  </th>
                  <th className="pb-3 text-right">
                    <SortHeader field="views" label="Views" />
                  </th>
                  <th className="pb-3 text-right">
                    <SortHeader field="likes" label="Likes" />
                  </th>
                  <th className="pb-3 text-right">
                    <SortHeader field="comments" label="Comments" />
                  </th>
                  <th className="pb-3 text-right">
                    <SortHeader field="engagement_rate" label="Engagement" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                {sortedVideos.map((video) => (
                  <tr key={video.id} className="hover:bg-surface-50">
                    <td className="py-3 pr-4 text-sm font-medium text-gray-800">
                      {video.title}
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-500">
                      {video.published_at
                        ? new Date(video.published_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </td>
                    <td className="py-3 text-right text-sm text-gray-700">
                      {formatNumber(video.views)}
                    </td>
                    <td className="py-3 text-right text-sm text-gray-700">
                      {formatNumber(video.likes)}
                    </td>
                    <td className="py-3 text-right text-sm text-gray-700">
                      {formatNumber(video.comments)}
                    </td>
                    <td className="py-3 text-right text-sm font-medium text-brand-primary">
                      {video.engagement_rate.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== ROW 5: Campaign Projection ===== */}
      {videos.length > 0 && (
        <div className="rounded-card bg-white p-6 shadow-card">
          <h2 className="mb-4 border-b border-surface-100 pb-3 text-lg font-semibold text-gray-800">
            Campaign Projection
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Budget
                </label>
                <div className="relative mt-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                    $
                  </span>
                  <input
                    className="w-full rounded-xl border border-surface-200 bg-surface-50 py-2.5 pl-8 pr-4 text-sm text-gray-800 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Campaign Goal
                </label>
                <select
                  className="mt-1 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                >
                  <option value="awareness">Awareness</option>
                  <option value="consideration">Consideration</option>
                  <option value="conversion">Conversion</option>
                </select>
              </div>
              <button
                className="w-full rounded-button bg-brand-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-500"
                onClick={() => setShowProjection(true)}
              >
                Run Projection
              </button>
            </div>

            {showProjection && (
              <div className="md:col-span-2">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  <div className="rounded-xl bg-surface-50 p-4">
                    <p className="text-xs text-gray-500">Estimated Reach</p>
                    <p className="mt-1 text-lg font-bold text-gray-800">
                      {projections[goal]?.reach}
                    </p>
                  </div>
                  <div className="rounded-xl bg-surface-50 p-4">
                    <p className="text-xs text-gray-500">
                      Expected Engagements
                    </p>
                    <p className="mt-1 text-lg font-bold text-gray-800">
                      {projections[goal]?.engagements}
                    </p>
                  </div>
                  <div className="rounded-xl bg-surface-50 p-4">
                    <p className="text-xs text-gray-500">Est. Conversions</p>
                    <p className="mt-1 text-lg font-bold text-gray-800">
                      {projections[goal]?.conversions}
                    </p>
                  </div>
                  <div className="rounded-xl bg-surface-50 p-4">
                    <p className="text-xs text-gray-500">Cost per Engagement</p>
                    <p className="mt-1 text-lg font-bold text-gray-800">
                      {projections[goal]?.cpe}
                    </p>
                  </div>
                  <div className="rounded-xl bg-surface-50 p-4">
                    <p className="text-xs text-gray-500">ROI Score</p>
                    <p className="mt-1 text-lg font-bold text-emerald-600">
                      {projections[goal]?.roi}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== ROW 6: Deal History ===== */}
      {creator.deal_history && creator.deal_history.length > 0 && (
        <div className="rounded-card bg-white p-6 shadow-card">
          <h2 className="mb-4 border-b border-surface-100 pb-3 text-lg font-semibold text-gray-800">
            Deal History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100">
                  <th className="pb-3 text-left text-xs font-medium text-gray-500">
                    Brand
                  </th>
                  <th className="pb-3 text-left text-xs font-medium text-gray-500">
                    Format
                  </th>
                  <th className="pb-3 text-right text-xs font-medium text-gray-500">
                    Rate
                  </th>
                  <th className="pb-3 text-left text-xs font-medium text-gray-500">
                    Date
                  </th>
                  <th className="pb-3 text-left text-xs font-medium text-gray-500">
                    Outcome
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                {creator.deal_history.map((deal, i) => (
                  <tr key={i} className="hover:bg-surface-50">
                    <td className="py-3 text-sm font-medium text-gray-800">
                      {deal.brand}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {deal.format}
                    </td>
                    <td className="py-3 text-right text-sm text-gray-700">
                      ${deal.rate.toLocaleString()}
                    </td>
                    <td className="py-3 text-sm text-gray-500">{deal.date}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          deal.outcome === "delivered"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {deal.outcome}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
