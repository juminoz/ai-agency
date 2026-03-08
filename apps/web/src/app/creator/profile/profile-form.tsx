"use client";

import { useActionState, useState } from "react";


import { saveCreatorProfile } from "./actions";

import { ScoreGauge } from "@/components/score-gauge";
import { type CreatorProfile } from "@/lib/supabase/types";



const ALL_CATEGORIES = [
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
  "Music",
  "Finance",
  "Health",
  "Sports",
];

interface Props {
  creator: CreatorProfile | null;
  sessionName: string;
  sessionEmail: string;
}

export function ProfileForm({ creator, sessionName, sessionEmail }: Props) {
  const [name, setName] = useState(creator?.name ?? sessionName ?? "");
  const [handle, setHandle] = useState(
    creator?.handle ?? sessionEmail.split("@")[0] ?? "",
  );
  const [bio, setBio] = useState(creator?.bio ?? "");
  const [minimumDeal, setMinimumDeal] = useState(
    creator?.minimum_deal_size ?? 500,
  );
  const [availability, setAvailability] = useState<"open" | "limited" | "closed">(
    creator?.availability_status ?? "open",
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    creator?.categories ?? [],
  );
  const [nicheTags, setNicheTags] = useState<string[]>(
    creator?.niche_tags ?? [],
  );
  const [newTag, setNewTag] = useState("");
  const [openTo, setOpenTo] = useState<string[]>(
    creator?.brand_preferences_open ?? [],
  );
  const [blocked, setBlocked] = useState<string[]>(
    creator?.brand_preferences_blocked ?? [],
  );
  const [channelUrl, setChannelUrl] = useState(creator?.channel_url ?? "");
  const [publicProfileUrl, setPublicProfileUrl] = useState(
    creator?.public_profile_url ?? "",
  );
  const [platform, setPlatform] = useState<"youtube" | "twitch">(creator?.platform ?? "youtube");

  const [_state, formAction, isPending] = useActionState(saveCreatorProfile, null);

  function addTag() {
    const tag = newTag.trim();
    if (tag && !nicheTags.includes(tag)) {
      setNicheTags([...nicheTags, tag]);
      setNewTag("");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          {creator
            ? "Manage your creator profile and see how brands will view you."
            : "Set up your creator profile so brands can find and work with you."}
        </p>
      </div>

      <form action={formAction}>
        {/* Hidden fields for array data */}
        <input name="name" type="hidden" value={name} />
        <input name="handle" type="hidden" value={handle} />
        <input name="platform" type="hidden" value={platform} />
        <input name="categories" type="hidden" value={JSON.stringify(selectedCategories)} />
        <input name="nicheTags" type="hidden" value={JSON.stringify(nicheTags)} />
        <input name="brandPreferencesOpen" type="hidden" value={JSON.stringify(openTo)} />
        <input name="brandPreferencesBlocked" type="hidden" value={JSON.stringify(blocked)} />
        <input name="channelUrl" type="hidden" value={channelUrl} />
        <input name="publicProfileUrl" type="hidden" value={publicProfileUrl} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column — Profile Settings */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Info */}
            <div className="rounded-card bg-white p-6 shadow-card">
              <div className="mb-4 border-b border-surface-100 pb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  Basic Info
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Display Name
                  </label>
                  <input
                    className="mt-1 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Handle
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      @
                    </span>
                    <input
                      className="w-full rounded-xl border border-surface-200 bg-surface-50 py-2.5 pl-8 pr-4 text-sm text-gray-800 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Platform
                  </label>
                  <select
                    className="mt-1 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as "youtube" | "twitch")}
                  >
                    <option value="youtube">YouTube</option>
                    <option value="twitch">Twitch</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Channel URL
                  </label>
                  <input
                    className="mt-1 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    placeholder="https://youtube.com/@yourchannel"
                    type="url"
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="rounded-card bg-white p-6 shadow-card">
              <div className="mb-4 border-b border-surface-100 pb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  Profile Details
                </h2>
              </div>

              <div className="space-y-5">
                {/* Bio */}
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Bio / Pitch Statement
                  </label>
                  <textarea
                    className="mt-1 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    maxLength={280}
                    name="bio"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 280))}
                  />
                  <p className="mt-1 text-right text-xs text-gray-400">
                    {bio.length} / 280
                  </p>
                </div>

                {/* Categories */}
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Categories
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ALL_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            isSelected
                              ? "bg-brand-primary text-white"
                              : "bg-surface-100 text-gray-600 hover:bg-surface-200"
                          }`}
                          type="button"
                          onClick={() => {
                            setSelectedCategories(
                              isSelected
                                ? selectedCategories.filter((c) => c !== cat)
                                : [...selectedCategories, cat],
                            );
                          }}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Niche Tags */}
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
                          className="ml-0.5 text-brand-400 hover:text-brand-600"
                          type="button"
                          onClick={() =>
                            setNicheTags(nicheTags.filter((t) => t !== tag))
                          }
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      className="flex-1 rounded-xl border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                      placeholder="Add a tag..."
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <button
                      className="rounded-xl bg-surface-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-surface-200"
                      type="button"
                      onClick={addTag}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Deal Settings */}
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
                        className="w-full rounded-xl border border-surface-200 bg-surface-50 py-2.5 pl-8 pr-4 text-sm text-gray-800 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                        name="minimumDealSize"
                        type="number"
                        value={minimumDeal}
                        onChange={(e) => setMinimumDeal(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Availability Status
                    </label>
                    <select
                      className="mt-1 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                      name="availabilityStatus"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value as "open" | "limited" | "closed")}
                    >
                      <option value="open">Open to deals</option>
                      <option value="limited">Limited availability</option>
                      <option value="closed">Not available</option>
                    </select>
                  </div>
                </div>

                {/* Public Profile URL */}
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Public Profile URL
                  </label>
                  <input
                    className="mt-1 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    placeholder="https://yoursite.com"
                    type="url"
                    value={publicProfileUrl}
                    onChange={(e) => setPublicProfileUrl(e.target.value)}
                  />
                </div>

                {/* Brand Preferences */}
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Brand Category Preferences
                  </label>
                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs font-medium text-emerald-600">
                        Open to working with
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {openTo.map((cat) => (
                          <span
                            key={cat}
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium capitalize text-emerald-700"
                          >
                            {cat}
                            <button
                              className="ml-0.5 text-emerald-500 hover:text-emerald-700"
                              type="button"
                              onClick={() =>
                                setOpenTo(openTo.filter((c) => c !== cat))
                              }
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                        {openTo.length === 0 && (
                          <span className="text-xs text-gray-400">
                            No preferences set
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-medium text-red-600">
                        Blocked categories
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {blocked.map((cat) => (
                          <span
                            key={cat}
                            className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium capitalize text-red-700"
                          >
                            {cat}
                            <button
                              className="ml-0.5 text-red-500 hover:text-red-700"
                              type="button"
                              onClick={() =>
                                setBlocked(blocked.filter((c) => c !== cat))
                              }
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                        {blocked.length === 0 && (
                          <span className="text-xs text-gray-400">
                            No blocked categories
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 border-t border-surface-100 pt-4">
                <button
                  className="rounded-button bg-brand-primary px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-500 disabled:opacity-50"
                  disabled={isPending}
                  type="submit"
                >
                  {isPending ? "Saving..." : creator ? "Save Profile" : "Create Profile"}
                </button>
              </div>
            </div>
          </div>

          {/* Right column — Profile Preview */}
          <div>
            <div className="sticky top-6 rounded-card bg-white p-6 shadow-card">
              <div className="mb-4 border-b border-surface-100 pb-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Profile Preview
                </h2>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-brand-primary text-xl font-bold text-white">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .filter(Boolean)
                    .join("")
                    .slice(0, 2) || "?"}
                </div>
                <h3 className="mt-3 text-lg font-bold text-gray-800">
                  {name || "Your Name"}
                </h3>
                <p className="text-sm text-gray-500">@{handle || "handle"}</p>
              </div>

              {creator && creator.score_overall > 0 && (
                <div className="my-5 flex justify-center">
                  <ScoreGauge
                    label="Brand Buddy Score"
                    score={creator.score_overall}
                    size={120}
                  />
                </div>
              )}

              {selectedCategories.length > 0 && (
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
              )}

              {bio && (
                <p className="mt-4 text-center text-sm text-gray-600">{bio}</p>
              )}

              {creator && (
                <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-surface-50 p-3">
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-800">
                      {creator.subscriber_count > 0
                        ? `${(creator.subscriber_count / 1000).toFixed(0)}K`
                        : "—"}
                    </p>
                    <p className="text-xs text-gray-500">Subscribers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-800">
                      {creator.video_count || "—"}
                    </p>
                    <p className="text-xs text-gray-500">Videos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-800">
                      {creator.completed_campaigns || 0}
                    </p>
                    <p className="text-xs text-gray-500">Campaigns</p>
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-center">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    availability === "open"
                      ? "bg-emerald-100 text-emerald-700"
                      : availability === "limited"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {availability === "open"
                    ? "Open to deals"
                    : availability === "limited"
                      ? "Limited availability"
                      : "Not available"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
