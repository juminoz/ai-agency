"use client";

import { useState } from "react";

import { type CreatorProfile } from "@/lib/supabase/types";


interface Props {
  creator: CreatorProfile | null;
  sessionName: string;
  sessionEmail: string;
}

export function CreatorSettingsForm({ creator, sessionName, sessionEmail }: Props) {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [dealNotifs, setDealNotifs] = useState(true);
  const [messageNotifs, setMessageNotifs] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Account Information */}
      <div className="rounded-card bg-white p-6 shadow-card">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Account Information
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Full Name
            </label>
            <p className="rounded-xl border border-gray-200 bg-surface-50 px-3 py-2.5 text-sm text-gray-700">
              {sessionName || "Not set"}
            </p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Email Address
            </label>
            <p className="rounded-xl border border-gray-200 bg-surface-50 px-3 py-2.5 text-sm text-gray-700">
              {sessionEmail}
            </p>
          </div>
          {creator && (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Handle
                </label>
                <p className="rounded-xl border border-gray-200 bg-surface-50 px-3 py-2.5 text-sm text-gray-700">
                  @{creator.handle}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Platform
                </label>
                <p className="rounded-xl border border-gray-200 bg-surface-50 px-3 py-2.5 text-sm capitalize text-gray-700">
                  {creator.platform}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-card bg-white p-6 shadow-card">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <ToggleRow
            checked={emailNotifs}
            description="Receive email notifications for important account updates."
            label="Email Notifications"
            onChange={setEmailNotifs}
          />
          <ToggleRow
            checked={dealNotifs}
            description="Get notified when you receive a new deal offer from a brand."
            label="New Deal Alerts"
            onChange={setDealNotifs}
          />
          <ToggleRow
            checked={messageNotifs}
            description="Get notified when you receive a new message."
            label="Message Notifications"
            onChange={setMessageNotifs}
          />
          <ToggleRow
            checked={marketingEmails}
            description="Receive tips, product updates, and promotional content."
            label="Marketing Emails"
            onChange={setMarketingEmails}
          />
        </div>
      </div>

      {/* Account Stats */}
      {creator && (
        <div className="rounded-card bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Account
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-surface-50 p-4">
              <p className="text-xs text-gray-500">Completed Campaigns</p>
              <p className="text-2xl font-bold text-gray-800">
                {creator.completed_campaigns}
              </p>
            </div>
            <div className="rounded-xl bg-surface-50 p-4">
              <p className="text-xs text-gray-500">Delivery Rate</p>
              <p className="text-2xl font-bold text-gray-800">
                {creator.delivery_rate > 0
                  ? `${(creator.delivery_rate * 100).toFixed(0)}%`
                  : "N/A"}
              </p>
            </div>
            <div className="rounded-xl bg-surface-50 p-4">
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="text-2xl font-bold text-gray-800">
                {new Date(creator.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="rounded-card border border-red-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-red-500">
          Danger Zone
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">Delete Account</p>
            <p className="text-xs text-gray-500">
              Permanently delete your account and all associated data.
            </p>
          </div>
          <button
            className="rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            type="button"
            onClick={() => alert("Please contact support to delete your account.")}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
          checked ? "bg-brand-primary" : "bg-gray-200"
        }`}
        role="switch"
        type="button"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
