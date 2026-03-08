"use client";

import { Flame, Monitor, Star, X, MapPin, Users, Target, Calendar } from "lucide-react";
import { useState, useTransition } from "react";

import { signalInterest } from "./actions";

import type { Brand, Brief } from "@/lib/supabase/types";

type BrandWithScore = Brand & {
  matchScore: number;
  activeBriefs: Brief[];
  hasExistingDeal: boolean;
};

interface Props {
  brands: BrandWithScore[];
  creatorName: string;
}

function formatBudget(min: number, max: number): string {
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;
  return `${fmt(min)} – ${fmt(max)}`;
}

/* ------------------------------------------------------------------ */
/*  Brand Detail Modal                                                 */
/* ------------------------------------------------------------------ */

function BrandDetailModal({
  brand,
  onClose,
  onSignalInterest,
}: {
  brand: BrandWithScore;
  onClose: () => void;
  onSignalInterest: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-card bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-100 bg-white px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-100 text-2xl font-bold text-brand-primary">
              {brand.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{brand.name}</h2>
              <p className="text-sm text-gray-500">{brand.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Match Score */}
          <div className="flex items-center justify-between rounded-xl bg-brand-50 p-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Audience Match Score</p>
              <p className="text-xs text-gray-500">Based on your profile and audience overlap</p>
            </div>
            <div className="text-3xl font-bold text-brand-primary">{brand.matchScore}%</div>
          </div>

          {/* About */}
          {brand.description && (
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">About</h3>
              <p className="text-sm leading-relaxed text-gray-700">{brand.description}</p>
            </div>
          )}

          {/* Target Audience */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Target Audience
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {brand.target_age_range && (
                <div className="flex items-center gap-2 rounded-xl bg-surface-50 p-3">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Age Range</p>
                    <p className="text-sm font-medium text-gray-700">{brand.target_age_range}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 rounded-xl bg-surface-50 p-3">
                <Target className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Gender</p>
                  <p className="text-sm font-medium capitalize text-gray-700">{brand.target_gender}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interests */}
          {brand.target_interests.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {brand.target_interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-600"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Locations */}
          {brand.target_locations.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Target Locations
              </h3>
              <div className="flex flex-wrap gap-2">
                {brand.target_locations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1 rounded-full bg-surface-100 px-3 py-1 text-xs text-gray-600"
                  >
                    <MapPin className="h-3 w-3" /> {loc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Active Opportunities */}
          {brand.activeBriefs.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Active Opportunities
              </h3>
              <div className="space-y-3">
                {brand.activeBriefs.map((brief) => (
                  <div
                    key={brief.id}
                    className="rounded-xl border border-surface-200 bg-surface-50 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{brief.title}</p>
                        {brief.description && (
                          <p className="mt-1 text-xs text-gray-500">{brief.description}</p>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {formatBudget(brief.budget_min, brief.budget_max)}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      {brief.goal && (
                        <span className="flex items-center gap-1 capitalize">
                          <Target className="h-3 w-3" /> {brief.goal}
                        </span>
                      )}
                      {brief.timeline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {brief.timeline}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Monitor className="h-3 w-3" /> {brief.platform}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {brief.content_formats.map((fmt) => (
                        <span
                          key={fmt}
                          className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-500"
                        >
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-surface-50 p-4">
            <div>
              <p className="text-xs text-gray-500">Completed Deals</p>
              <p className="text-xl font-bold text-gray-800">{brand.completed_deals}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Reliability</p>
              <p className="text-xl font-bold text-gray-800">
                {brand.reliability_score ? `${brand.reliability_score}/5` : "New"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="text-sm font-medium text-gray-700">
                {new Date(brand.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Action */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-button border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-surface-50"
            >
              Close
            </button>
            {brand.hasExistingDeal ? (
              <span className="flex flex-1 items-center justify-center rounded-button bg-surface-100 px-4 py-2.5 text-sm font-medium text-gray-500">
                Interest Already Sent
              </span>
            ) : (
              <button
                onClick={onSignalInterest}
                className="flex-1 rounded-button bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-500"
              >
                Signal Interest
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Signal Interest Modal                                              */
/* ------------------------------------------------------------------ */

function SignalInterestModal({
  brand,
  creatorName,
  onClose,
  onSuccess,
}: {
  brand: BrandWithScore;
  creatorName: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [message, setMessage] = useState(
    `Hi ${brand.name}! I'm ${creatorName} and I'd love to collaborate with your brand. I think my audience would be a great fit for what you're looking for.`,
  );
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    const formData = new FormData();
    formData.set("brandId", brand.id);
    formData.set("brandName", brand.name);
    formData.set("message", message);

    startTransition(async () => {
      await signalInterest(formData);
      onSuccess();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-card bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-surface-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Signal Interest</h2>
            <p className="text-sm text-gray-500">Send a message to {brand.name}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <label className="mb-2 block text-xs font-medium text-gray-600">
            Your Message
          </label>
          <textarea
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-400">
            This will create a deal conversation with the brand.
          </p>

          <div className="mt-5 flex gap-3">
            <button
              onClick={onClose}
              disabled={isPending}
              className="flex-1 rounded-button border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-surface-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending || !message.trim()}
              className="flex-1 rounded-button bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-500 disabled:opacity-50"
            >
              {isPending ? "Sending..." : "Send Interest"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Success Toast                                                      */
/* ------------------------------------------------------------------ */

function SuccessToast({ brandName, onDismiss }: { brandName: string; onDismiss: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white shadow-lg">
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      Interest sent to {brandName}!
      <button onClick={onDismiss} className="ml-2 text-white/70 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Client Component                                              */
/* ------------------------------------------------------------------ */

export function BrandDiscoveryClient({ brands, creatorName }: Props) {
  const [detailBrand, setDetailBrand] = useState<BrandWithScore | null>(null);
  const [interestBrand, setInterestBrand] = useState<BrandWithScore | null>(null);
  const [successBrand, setSuccessBrand] = useState<string | null>(null);
  // Track brands that just had interest sent (optimistic)
  const [sentInterestIds, setSentInterestIds] = useState<Set<string>>(new Set());

  function handleSignalFromDetail() {
    if (detailBrand) {
      setDetailBrand(null);
      setInterestBrand(detailBrand);
    }
  }

  function handleInterestSuccess() {
    if (interestBrand) {
      setSentInterestIds((prev) => new Set(prev).add(interestBrand.id));
      setSuccessBrand(interestBrand.name);
      setInterestBrand(null);
      setTimeout(() => setSuccessBrand(null), 4000);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Brand Opportunities</h2>
        <p className="mt-1 text-sm text-gray-500">
          Brands ranked by how well their audience targets match your profile.{" "}
          <span className="font-medium text-brand-primary">
            {brands.length} brands
          </span>{" "}
          available.
        </p>
      </div>

      <div className="space-y-4">
        {brands.map((brand, idx) => {
          const alreadySent = brand.hasExistingDeal || sentInterestIds.has(brand.id);

          return (
            <div
              key={brand.id}
              className="group rounded-card bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-100 text-2xl font-bold text-brand-primary">
                    {brand.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-800">{brand.name}</h3>
                      {idx === 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                          <Flame className="h-3 w-3" /> HIGH MATCH
                        </span>
                      )}
                      {idx > 0 && idx < 3 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-semibold text-accent-400">
                          <Star className="h-3 w-3" /> Suggested
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {brand.category} · {brand.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {brand.target_interests.map((interest) => (
                        <span
                          key={interest}
                          className="rounded-full bg-surface-100 px-2.5 py-0.5 text-xs text-gray-600"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-brand-primary">{brand.matchScore}%</div>
                  <div className="text-xs text-gray-500">Audience Match</div>
                </div>
              </div>

              {brand.activeBriefs.length > 0 && (
                <div className="mt-4 border-t border-surface-200 pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Active Opportunities
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {brand.activeBriefs.map((brief) => (
                      <div
                        key={brief.id}
                        className="rounded-xl border border-surface-200 bg-surface-50 p-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{brief.title}</p>
                            <p className="mt-0.5 text-xs text-gray-500">
                              {brief.goal} · {brief.timeline}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            {formatBudget(brief.budget_min, brief.budget_max)}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          {brief.content_formats.map((fmt) => (
                            <span
                              key={fmt}
                              className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-500"
                            >
                              {fmt}
                            </span>
                          ))}
                          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs text-gray-500">
                            <Monitor className="h-3 w-3" /> {brief.platform}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  {brand.completed_deals} completed deals on Brand Buddy
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDetailBrand(brand)}
                    className="rounded-button border border-surface-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-surface-50"
                  >
                    View Details
                  </button>
                  {alreadySent ? (
                    <span className="inline-flex items-center rounded-button bg-surface-100 px-4 py-2 text-sm font-medium text-gray-500">
                      <svg className="mr-1.5 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Interest Sent
                    </span>
                  ) : (
                    <button
                      onClick={() => setInterestBrand(brand)}
                      className="rounded-button bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500"
                    >
                      Signal Interest
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Details Modal */}
      {detailBrand && (
        <BrandDetailModal
          brand={detailBrand}
          onClose={() => setDetailBrand(null)}
          onSignalInterest={handleSignalFromDetail}
        />
      )}

      {/* Signal Interest Modal */}
      {interestBrand && (
        <SignalInterestModal
          brand={interestBrand}
          creatorName={creatorName}
          onClose={() => setInterestBrand(null)}
          onSuccess={handleInterestSuccess}
        />
      )}

      {/* Success Toast */}
      {successBrand && (
        <SuccessToast
          brandName={successBrand}
          onDismiss={() => setSuccessBrand(null)}
        />
      )}
    </div>
  );
}
