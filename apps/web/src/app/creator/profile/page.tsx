"use client";

import { useState } from "react";

import { ScoreGauge } from "@/components/score-gauge";
import creators from "@/data/mock/creators.json";

const creator = creators.find((c) => c.id === "creator-1")!;

const allCategories = [
  "Travel",
  "Japan",
  "Lifestyle",
  "Food",
  "Tech",
  "Fashion",
  "Gaming",
  "Fitness",
  "Education",
  "Beauty",
];

export default function CreatorProfilePage() {
  const [bio, setBio] = useState(creator.bio);
  const [minimumDeal, setMinimumDeal] = useState(creator.minimumDealSize);
  const [isAvailable, setIsAvailable] = useState(
    creator.availabilityStatus === "open"
  );
  const [mediaKitUrl, setMediaKitUrl] = useState(
    "https://ashleypeters.com/media-kit"
  );
  const [selectedCategories, setSelectedCategories] = useState(
    creator.categories
  );
  const [nicheTags, setNicheTags] = useState(creator.nicheTags);
  const [openTo, setOpenTo] = useState(creator.brandPreferences.open);
  const [blocked, setBlocked] = useState(creator.brandPreferences.blocked);

  const avgViews = Math.round(
    creator.recentVideos.reduce((sum, v) => sum + v.views, 0) /
      creator.recentVideos.length
  );
  const avgEngagement =
    creator.recentVideos.reduce((sum, v) => sum + v.engagementRate, 0) /
    creator.recentVideos.length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your creator profile and see how brands will view you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column — Profile Settings */}
        <div className="space-y-6 lg:col-span-2">
          {/* Channel Info (read-only) */}
          <div className="rounded-card bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between border-b border-surface-100 pb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Channel Info
              </h2>
              <span className="text-xs text-gray-400">
                Pulled from platform API
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Channel Name
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {creator.name}
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                    </svg>
                    YouTube
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">
                  Subscribers
                </label>
                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {creator.subscriberCount.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">
                  Video Count
                </label>
                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {creator.videoCount}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">
                  Channel URL
                </label>
                <a
                  href={creator.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-sm font-medium text-brand-primary hover:text-brand-600"
                >
                  {creator.channelUrl}
                </a>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 border-t border-surface-100 pt-4">
              <button className="inline-flex items-center gap-2 rounded-button bg-surface-100 px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-surface-200">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh Data
              </button>
              <span className="text-xs text-gray-400">
                Last refreshed: Mar 7, 2026 at 2:34 PM
              </span>
            </div>
          </div>

          {/* Profile Details (editable) */}
          <div className="rounded-card bg-white p-6 shadow-card">
            <div className="mb-4 border-b border-surface-100 pb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Profile Details
              </h2>
            </div>

            <div className="space-y-5">
              {/* Bio / Pitch Statement */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Bio / Pitch Statement
                </label>
                <textarea
                  value={bio}
                  onChange={(e) =>
                    setBio(e.target.value.slice(0, 280))
                  }
                  maxLength={280}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />
                <p className="mt-1 text-right text-xs text-gray-400">
                  {bio.length} / 280
                </p>
              </div>

              {/* Categories & Niche Tags */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Category &amp; Niche Tags
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {allCategories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedCategories(
                              selectedCategories.filter((c) => c !== cat)
                            );
                          } else {
                            setSelectedCategories([
                              ...selectedCategories,
                              cat,
                            ]);
                          }
                        }}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          isSelected
                            ? "bg-brand-primary text-white"
                            : "bg-surface-100 text-gray-600 hover:bg-surface-200"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">
                  Niche Tags
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {nicheTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-600"
                    >
                      {tag}
                      <button
                        onClick={() =>
                          setNicheTags(nicheTags.filter((t) => t !== tag))
                        }
                        className="ml-0.5 text-brand-400 hover:text-brand-600"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Minimum Deal Size */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Minimum Deal Size
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={minimumDeal}
                      onChange={(e) =>
                        setMinimumDeal(Number(e.target.value))
                      }
                      className="w-full rounded-xl border border-surface-200 bg-surface-50 py-2.5 pl-8 pr-4 text-sm text-gray-800 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Availability Status
                  </label>
                  <div className="mt-1 flex items-center gap-3">
                    <button
                      onClick={() => setIsAvailable(!isAvailable)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                        isAvailable ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          isAvailable ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span
                      className={`text-sm font-medium ${
                        isAvailable ? "text-emerald-600" : "text-gray-500"
                      }`}
                    >
                      {isAvailable ? "Open to deals" : "Not Available"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Media Kit URL */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Media Kit URL
                </label>
                <input
                  type="url"
                  value={mediaKitUrl}
                  onChange={(e) => setMediaKitUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  placeholder="https://yoursite.com/media-kit"
                />
              </div>

              {/* Brand Category Preferences */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Brand Category Preferences
                </label>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-medium text-emerald-600">
                      Open to
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {openTo.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium capitalize text-emerald-700"
                        >
                          {cat}
                          <button
                            onClick={() =>
                              setOpenTo(openTo.filter((c) => c !== cat))
                            }
                            className="ml-0.5 text-emerald-500 hover:text-emerald-700"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-medium text-red-600">
                      Blocked
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {blocked.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium capitalize text-red-700"
                        >
                          {cat}
                          <button
                            onClick={() =>
                              setBlocked(blocked.filter((c) => c !== cat))
                            }
                            className="ml-0.5 text-red-500 hover:text-red-700"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 border-t border-surface-100 pt-4">
              <button className="rounded-button bg-brand-primary px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-500">
                Save Profile
              </button>
            </div>
          </div>
        </div>

        {/* Right column — Public Profile Preview */}
        <div>
          <div className="sticky top-6 rounded-card bg-white p-6 shadow-card">
            <div className="mb-4 border-b border-surface-100 pb-3">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Public Profile Preview
              </h2>
            </div>

            {/* Avatar + Name */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-brand-primary text-xl font-bold text-white">
                {creator.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="mt-3 text-lg font-bold text-gray-800">
                {creator.name}
              </h3>
              <p className="text-sm text-gray-500">@{creator.handle}</p>
            </div>

            {/* Score gauge */}
            <div className="my-5 flex justify-center">
              <ScoreGauge
                score={creator.score.overall}
                label="Brand Buddy Score"
                size={120}
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-1.5">
              {selectedCategories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-600"
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Bio */}
            <p className="mt-4 text-center text-sm text-gray-600">{bio}</p>

            {/* Stats */}
            <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-surface-50 p-3">
              <div className="text-center">
                <p className="text-sm font-bold text-gray-800">
                  {(creator.subscriberCount / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-gray-500">Subscribers</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-800">
                  {(avgViews / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-gray-500">Avg Views</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-800">
                  {avgEngagement.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">Engagement</p>
              </div>
            </div>

            {/* Availability */}
            <div className="mt-4 flex justify-center">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isAvailable
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {isAvailable ? "Open to deals" : "Not available"}
              </span>
            </div>

            {/* Track Record */}
            <div className="mt-4 rounded-xl bg-surface-50 p-3">
              <p className="text-center text-sm text-gray-600">
                <span className="font-semibold text-gray-800">
                  {creator.trackRecord.completedCampaigns} campaigns
                </span>
                {" "}completed,{" "}
                <span className="font-semibold text-emerald-600">
                  {creator.trackRecord.deliveryRate}% delivery rate
                </span>
              </p>
            </div>

            {/* Public Profile Link */}
            <div className="mt-4 text-center">
              <a
                href={`https://${creator.publicProfileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:text-brand-600"
              >
                View Public Profile
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
