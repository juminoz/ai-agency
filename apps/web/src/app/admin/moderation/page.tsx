"use client";

import { useState } from "react";

import adminStats from "@/data/mock/admin-stats.json";

type Tab = "registrations" | "reports" | "flagged";

const registrationQueue = [
  {
    id: "rq-1",
    name: "TotallyRealInfluencer",
    channel: "@totallyreal",
    platform: "youtube",
    subscribers: 50000,
    flagReason: "Channel created 3 days ago with 50K subscribers — possible purchased account",
    date: "2026-03-08",
  },
  {
    id: "rq-2",
    name: "QuickCashGamer",
    channel: "@quickcashgamer",
    platform: "twitch",
    subscribers: 22000,
    flagReason: "Potential fake engagement detected — like-to-view ratio anomaly",
    date: "2026-03-07",
  },
  {
    id: "rq-3",
    name: "BotNetKing",
    channel: "@botnetking",
    platform: "youtube",
    subscribers: 120000,
    flagReason: "90% of comments appear bot-generated (repetitive phrases, new accounts)",
    date: "2026-03-06",
  },
  {
    id: "rq-4",
    name: "EmmaPlays",
    channel: "@emmaplays",
    platform: "twitch",
    subscribers: 5600,
    flagReason: "Duplicate account detected — same email as existing creator",
    date: "2026-03-06",
  },
];

const contentReports = [
  {
    id: "cr-1",
    reporter: "NovaTech (Brand)",
    reportedUser: "FitnessFrenzy",
    contentPreview: "Creator posted sponsored content without required disclosure tags...",
    reason: "Missing sponsorship disclosure",
    date: "2026-03-07",
  },
  {
    id: "cr-2",
    reporter: "Ashley Peters (Creator)",
    reportedUser: "SpamReviewer42",
    contentPreview: "Left 15 identical negative reviews across multiple creator profiles...",
    reason: "Spam / fake reviews",
    date: "2026-03-06",
  },
  {
    id: "cr-3",
    reporter: "System (Automated)",
    reportedUser: "GrowFast Agency",
    contentPreview: "Profile bio contains links to external follower-buying service...",
    reason: "Prohibited content in profile",
    date: "2026-03-05",
  },
  {
    id: "cr-4",
    reporter: "FuelUp Nutrition (Brand)",
    reportedUser: "Jordan Flex",
    contentPreview: "Brand message contains inappropriate language and harassment...",
    reason: "Harassment in messages",
    date: "2026-03-04",
  },
];

const flaggedAccounts = [
  {
    id: "fa-1",
    name: "QuickCashGamer",
    type: "creator" as const,
    flagCount: 5,
    mostRecentReason: "Fake engagement pattern detected across multiple videos",
    accountAge: "2 months",
  },
  {
    id: "fa-2",
    name: "GrowFast Agency",
    type: "brand" as const,
    flagCount: 3,
    mostRecentReason: "Promoting follower-buying services through platform messaging",
    accountAge: "3 weeks",
  },
  {
    id: "fa-3",
    name: "BotNetKing",
    type: "creator" as const,
    flagCount: 4,
    mostRecentReason: "Bot-generated comments and artificially inflated metrics",
    accountAge: "1 month",
  },
  {
    id: "fa-4",
    name: "ShadyDeals Inc.",
    type: "brand" as const,
    flagCount: 2,
    mostRecentReason: "Multiple creators report non-payment after content delivery",
    accountAge: "4 months",
  },
];

const tabs: { key: Tab; label: string; count: number }[] = [
  { key: "registrations", label: "Registration Queue", count: registrationQueue.length },
  { key: "reports", label: "Content Reports", count: contentReports.length },
  { key: "flagged", label: "Flagged Accounts", count: flaggedAccounts.length },
];

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState<Tab>("registrations");

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-card bg-white p-6 shadow-card">
          <p className="text-3xl font-bold text-orange-600">{adminStats.pendingModeration}</p>
          <p className="mt-1 text-sm text-gray-500">Pending Moderation</p>
        </div>
        <div className="rounded-card bg-white p-6 shadow-card">
          <p className="text-3xl font-bold text-red-600">{adminStats.flaggedAccounts}</p>
          <p className="mt-1 text-sm text-gray-500">Flagged Accounts</p>
        </div>
        <div className="rounded-card bg-white p-6 shadow-card">
          <p className="text-3xl font-bold text-gray-800">{adminStats.moderationQueue.length}</p>
          <p className="mt-1 text-sm text-gray-500">Queue Items</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-card bg-white shadow-card">
        <div className="border-b border-gray-100">
          <nav className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-brand-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.key ? "bg-brand-100 text-brand-600" : "bg-gray-100 text-gray-500"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "registrations" && <RegistrationQueueTab />}
          {activeTab === "reports" && <ContentReportsTab />}
          {activeTab === "flagged" && <FlaggedAccountsTab />}
        </div>
      </div>
    </div>
  );
}

function RegistrationQueueTab() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
            <th className="pb-3 pr-4 font-medium">Name</th>
            <th className="pb-3 pr-4 font-medium">Channel</th>
            <th className="pb-3 pr-4 font-medium">Platform</th>
            <th className="pb-3 pr-4 font-medium">Subscribers</th>
            <th className="pb-3 pr-4 font-medium">Flag Reason</th>
            <th className="pb-3 pr-4 font-medium">Date</th>
            <th className="pb-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {registrationQueue.map((item) => (
            <tr key={item.id} className="border-b border-gray-50 hover:bg-surface-50">
              <td className="py-3 pr-4 font-medium text-gray-800">{item.name}</td>
              <td className="py-3 pr-4 text-gray-600">{item.channel}</td>
              <td className="py-3 pr-4 capitalize text-gray-600">{item.platform}</td>
              <td className="py-3 pr-4 text-gray-600">{item.subscribers.toLocaleString()}</td>
              <td className="max-w-xs py-3 pr-4 text-gray-600">{item.flagReason}</td>
              <td className="py-3 pr-4 text-gray-500">{item.date}</td>
              <td className="py-3">
                <div className="flex gap-1.5">
                  <ActionButton variant="approve">Approve</ActionButton>
                  <ActionButton variant="reject">Reject</ActionButton>
                  <ActionButton variant="neutral">Review</ActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContentReportsTab() {
  return (
    <div className="space-y-4">
      {contentReports.map((report) => (
        <div key={report.id} className="rounded-xl border border-gray-100 p-4 hover:border-gray-200">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">
                <span className="text-gray-400">Reporter:</span> {report.reporter}
              </p>
              <p className="text-sm font-medium text-gray-800">
                <span className="text-gray-400">Reported:</span> {report.reportedUser}
              </p>
            </div>
            <span className="text-xs text-gray-400">{report.date}</span>
          </div>
          <p className="mb-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{report.contentPreview}</p>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
              {report.reason}
            </span>
            <div className="flex gap-1.5">
              <ActionButton variant="neutral">Dismiss</ActionButton>
              <ActionButton variant="warning">Warn User</ActionButton>
              <ActionButton variant="reject">Suspend User</ActionButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FlaggedAccountsTab() {
  return (
    <div className="space-y-4">
      {flaggedAccounts.map((account) => (
        <div key={account.id} className="rounded-xl border border-gray-100 p-4 hover:border-gray-200">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <h4 className="font-semibold text-gray-800">{account.name}</h4>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                account.type === "creator" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
              }`}>
                {account.type}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                {account.flagCount} flags
              </span>
            </div>
          </div>
          <p className="mb-2 text-sm text-gray-600">{account.mostRecentReason}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Account age: {account.accountAge}</span>
            <div className="flex gap-1.5">
              <ActionButton variant="neutral">Review Profile</ActionButton>
              <ActionButton variant="warning">Suspend</ActionButton>
              <ActionButton variant="reject">Remove</ActionButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActionButton({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "approve" | "reject" | "neutral" | "warning";
}) {
  const styles: Record<string, string> = {
    approve: "border-green-300 text-green-700 hover:bg-green-50",
    reject: "border-red-300 text-red-700 hover:bg-red-50",
    neutral: "border-gray-200 text-gray-600 hover:bg-gray-50",
    warning: "border-orange-300 text-orange-700 hover:bg-orange-50",
  };

  return (
    <button className={`rounded-button border px-3 py-1 text-xs font-medium ${styles[variant]}`}>
      {children}
    </button>
  );
}
