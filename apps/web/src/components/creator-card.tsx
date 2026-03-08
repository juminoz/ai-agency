"use client";

import Link from "next/link";
import { useState } from "react";

interface Creator {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  bio: string;
  platform: string;
  isOnPlatform?: boolean;
  subscriberCount: number;
  categories: string[];
  nicheTags: string[];
  availabilityStatus: string;
  minimumDealSize: number;
  score: {
    overall: number;
    engagementHealth: number;
    [key: string]: number;
  };
  audienceInterests: { category: string; confidence: number }[];
  trackRecord: {
    completedCampaigns: number;
    deliveryRate: number;
    avgPerformanceVsProjection: string;
    avgRating: number;
  };
  recentVideos: { views: number }[];
}

interface CreatorCardProps {
  creator: Creator;
}

// Gradient palette for banner placeholders
const GRADIENTS = [
  "from-blue-400 to-indigo-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-purple-500",
  "from-cyan-400 to-blue-500",
  "from-fuchsia-400 to-pink-500",
  "from-lime-400 to-green-500",
];

function getGradient(id: string): string {
  const idx = id.charCodeAt(id.length - 1) % GRADIENTS.length;
  return GRADIENTS[idx]!;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function avgViews(videos: { views: number }[]): string {
  if (!videos.length) return "0";
  const avg = videos.reduce((s, v) => s + v.views, 0) / videos.length;
  return formatCount(avg);
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <svg
          key={`f-${i}`}
          className="h-4 w-4 text-amber-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {half && (
        <svg
          className="h-4 w-4 text-amber-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            fill="url(#halfGrad)"
          />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg
          key={`e-${i}`}
          className="h-4 w-4 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-gray-500">{rating.toFixed(1)}</span>
    </div>
  );
}

export function CreatorCard({ creator }: CreatorCardProps) {
  const [saved, setSaved] = useState(false);
  const gradient = getGradient(creator.id);
  const engagement = creator.score.engagementHealth;
  const topInterests = creator.audienceInterests.slice(0, 2);

  return (
    <div className="group overflow-hidden rounded-card bg-white shadow-card transition-shadow hover:shadow-card-hover">
      {/* Banner */}
      <div className={`relative h-32 bg-gradient-to-br ${gradient}`}>
        {/* Platform badge */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-700">
          {creator.platform}
        </span>

        {/* On-platform status */}
        {creator.isOnPlatform !== undefined && (
          <span
            className={`absolute left-3 top-10 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              creator.isOnPlatform
                ? "bg-emerald-500/90 text-white"
                : "bg-gray-800/70 text-gray-200"
            }`}
          >
            {creator.isOnPlatform ? "On Platform" : "Channel Only"}
          </span>
        )}

        {/* Save / heart button */}
        <button
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition-colors hover:bg-white"
          onClick={() => setSaved(!saved)}
        >
          <svg
            className={`h-4 w-4 ${saved ? "fill-rose-500 text-rose-500" : "fill-none text-gray-500"}`}
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Avatar circle */}
        <div className="absolute -bottom-6 left-4 flex h-14 w-14 items-center justify-center rounded-full border-3 border-white bg-white text-xl font-bold text-brand-primary shadow-sm">
          {creator.name.charAt(0)}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 pt-9">
        {/* Name */}
        <h3 className="text-base font-bold text-gray-800">{creator.name}</h3>

        {/* Categories */}
        <p className="mt-0.5 text-xs text-gray-500">
          {creator.categories.join(" · ")}
        </p>

        {/* Score + Engagement */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">
            Brand Buddy Score: {creator.score.overall}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              engagement >= 85
                ? "bg-emerald-100 text-emerald-700"
                : engagement >= 70
                  ? "bg-amber-100 text-amber-700"
                  : "bg-rose-100 text-rose-700"
            }`}
          >
            {engagement}%
          </span>
        </div>

        {/* Avg Views */}
        <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
            <path
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <span>Avg Views: {avgViews(creator.recentVideos)}</span>
        </div>

        {/* Interest tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {topInterests.map((interest) => (
            <span
              key={interest.category}
              className="rounded-full bg-surface-100 px-3 py-1 text-xs text-gray-600"
            >
              {interest.category}
            </span>
          ))}
        </div>

        {/* Star rating */}
        <div className="mt-3">
          <StarRating rating={creator.trackRecord.avgRating} />
        </div>

        {/* View Profile button */}
        <Link
          className="mt-4 block w-full rounded-button bg-brand-primary px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-brand-500"
          href={`/brand/creators/${creator.id}`}
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
