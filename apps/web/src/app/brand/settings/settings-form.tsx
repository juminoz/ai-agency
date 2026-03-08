"use client";

import { useActionState, useState } from "react";

import { type Brand } from "@/lib/supabase/types";

import { saveBrandSettings } from "./actions";



interface Props {
  brand: Brand | null;
  sessionName: string;
  sessionEmail: string;
}

export function BrandSettingsForm({ brand, sessionName }: Props) {
  const [name, setName] = useState(brand?.name ?? sessionName ?? "");
  const [category, setCategory] = useState(brand?.category ?? "");
  const [description, setDescription] = useState(brand?.description ?? "");
  const [targetAgeRange, setTargetAgeRange] = useState(
    brand?.target_age_range ?? "",
  );
  const [targetGender, setTargetGender] = useState(
    brand?.target_gender ?? "all",
  );
  const [interests, setInterests] = useState<string[]>(
    brand?.target_interests ?? [],
  );
  const [newInterest, setNewInterest] = useState("");
  const [locations, setLocations] = useState<string[]>(
    brand?.target_locations ?? [],
  );
  const [newLocation, setNewLocation] = useState("");

  const [_state, formAction, isPending] = useActionState(saveBrandSettings, null);

  function addInterest() {
    const val = newInterest.trim();
    if (val && !interests.includes(val)) {
      setInterests([...interests, val]);
      setNewInterest("");
    }
  }

  function addLocation() {
    const val = newLocation.trim();
    if (val && !locations.includes(val)) {
      setLocations([...locations, val]);
      setNewLocation("");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          {brand
            ? "Manage your brand profile and preferences."
            : "Set up your brand profile so creators can find you."}
        </p>
      </div>

      <form action={formAction}>
        <input name="targetInterests" type="hidden" value={JSON.stringify(interests)} />
        <input name="targetLocations" type="hidden" value={JSON.stringify(locations)} />

        {/* Brand Profile */}
        <div className="rounded-card bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Brand Profile
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Brand Name
              </label>
              <input
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Category
              </label>
              <input
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                name="category"
                placeholder="e.g. Technology, Travel, Fashion"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Description
              </label>
              <textarea
                className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                name="description"
                placeholder="Tell creators about your brand..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div className="mt-6 rounded-card bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Target Audience
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Age Range
              </label>
              <input
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                name="targetAgeRange"
                placeholder="e.g. 18-34"
                type="text"
                value={targetAgeRange}
                onChange={(e) => setTargetAgeRange(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Gender
              </label>
              <select
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                name="targetGender"
                value={targetGender}
                onChange={(e) => setTargetGender(e.target.value)}
              >
                <option value="all">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1 rounded-full bg-surface-100 px-3 py-1 text-sm text-gray-700"
                  >
                    {interest}
                    <button
                      className="ml-1 text-gray-400 hover:text-gray-600"
                      type="button"
                      onClick={() =>
                        setInterests(interests.filter((i) => i !== interest))
                      }
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  placeholder="Add an interest..."
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addInterest();
                    }
                  }}
                />
                <button
                  className="rounded-xl bg-surface-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-surface-200"
                  type="button"
                  onClick={addInterest}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Locations
              </label>
              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1 rounded-full bg-surface-100 px-3 py-1 text-sm text-gray-700"
                  >
                    {loc}
                    <button
                      className="ml-1 text-gray-400 hover:text-gray-600"
                      type="button"
                      onClick={() =>
                        setLocations(locations.filter((l) => l !== loc))
                      }
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  placeholder="Add a location..."
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLocation();
                    }
                  }}
                />
                <button
                  className="rounded-xl bg-surface-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-surface-200"
                  type="button"
                  onClick={addLocation}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Stats (read-only) */}
        {brand && (
          <div className="mt-6 rounded-card bg-white p-6 shadow-card">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Account
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-surface-50 p-4">
                <p className="text-xs text-gray-500">Completed Deals</p>
                <p className="text-2xl font-bold text-gray-800">
                  {brand.completed_deals}
                </p>
              </div>
              <div className="rounded-xl bg-surface-50 p-4">
                <p className="text-xs text-gray-500">Reliability Score</p>
                <p className="text-2xl font-bold text-gray-800">
                  {brand.reliability_score ?? "N/A"}
                </p>
              </div>
              <div className="rounded-xl bg-surface-50 p-4">
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-2xl font-bold text-gray-800">
                  {new Date(brand.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Save button */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-button bg-brand-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-500 disabled:opacity-50"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Saving..." : brand ? "Save Changes" : "Create Brand Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
