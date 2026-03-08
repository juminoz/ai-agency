"use client";

import adminStats from "@/data/mock/admin-stats.json";

const tierColors: Record<string, string> = {
  nano: "bg-blue-400",
  micro: "bg-green-400",
  mid: "bg-yellow-400",
  macro: "bg-orange-400",
  mega: "bg-red-400",
};

const tierLabels: Record<string, string> = {
  nano: "Nano (1K-10K)",
  micro: "Micro (10K-100K)",
  mid: "Mid (100K-500K)",
  macro: "Macro (1M-5M)",
  mega: "Mega (5M+)",
};

const severityBadge: Record<string, string> = {
  low: "bg-yellow-100 text-yellow-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-red-100 text-red-800",
};

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    verified: "bg-green-100 text-green-800",
    pending_verification: "bg-yellow-100 text-yellow-800",
    suspended: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  };
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-800"}`}>
      {label}
    </span>
  );
}

export default function AdminDashboardPage() {
  const stats = adminStats;
  const totalByTier = Object.values(stats.creatorsByTier).reduce((a, b) => a + b, 0);
  const totalByPlatform = stats.creatorsByPlatform.youtube + stats.creatorsByPlatform.twitch;
  const quotaPercent = Math.round((stats.apiQuotaUsed / stats.apiQuotaLimit) * 100);

  return (
    <div className="space-y-6">
      {/* Row 1: Top Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Creators" value={formatNumber(stats.totalCreators)} growth="+12% this month" />
        <StatCard label="Total Brands" value={formatNumber(stats.totalBrands)} />
        <StatCard label="Active Deals" value={stats.activeDeals.toString()} />
        <StatCard label="Completed Deals" value={stats.completedDeals.toString()} />
      </div>

      {/* Row 2: Platform Health */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Creators by Tier */}
        <div className="rounded-card bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Creators by Tier</h3>
          {/* Stacked bar */}
          <div className="mb-4 flex h-6 w-full overflow-hidden rounded-full">
            {Object.entries(stats.creatorsByTier).map(([tier, count]) => (
              <div
                key={tier}
                className={`${tierColors[tier]} relative`}
                style={{ width: `${(count / totalByTier) * 100}%` }}
                title={`${tierLabels[tier]}: ${count}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {Object.entries(stats.creatorsByTier).map(([tier, count]) => (
              <div key={tier} className="flex items-center gap-2 text-sm">
                <span className={`h-3 w-3 rounded-full ${tierColors[tier]}`} />
                <span className="text-gray-600">{tierLabels[tier]}:</span>
                <span className="font-semibold text-gray-800">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Creators by Platform + API Quota */}
        <div className="rounded-card bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Platform & API Health</h3>

          {/* Platform bars */}
          <div className="mb-5 space-y-3">
            {(["youtube", "twitch"] as const).map((p) => {
              const count = stats.creatorsByPlatform[p];
              const pct = Math.round((count / totalByPlatform) * 100);
              return (
                <div key={p}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium capitalize text-gray-700">{p}</span>
                    <span className="text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${p === "youtube" ? "bg-red-500" : "bg-purple-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* API Quota */}
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">API Quota Usage</span>
              <span className="text-gray-500">{stats.apiQuotaUsed.toLocaleString()} / {stats.apiQuotaLimit.toLocaleString()}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${quotaPercent > 80 ? "bg-red-500" : quotaPercent > 60 ? "bg-yellow-500" : "bg-brand-primary"}`}
                style={{ width: `${quotaPercent}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">{quotaPercent}% used</p>
          </div>
        </div>
      </div>

      {/* Row 3: Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent Registrations */}
        <div className="rounded-card bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Recent Registrations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                  <th className="pb-2 pr-4 font-medium">Name</th>
                  <th className="pb-2 pr-4 font-medium">Type</th>
                  <th className="pb-2 pr-4 font-medium">Platform</th>
                  <th className="pb-2 pr-4 font-medium">Date</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-gray-50 hover:bg-surface-50">
                    <td className="py-2.5 pr-4 font-medium text-gray-800">{reg.name}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${reg.type === "creator" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
                        {reg.type}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 capitalize text-gray-600">{reg.platform ?? "—"}</td>
                    <td className="py-2.5 pr-4 text-gray-500">{formatDate(reg.registeredAt)}</td>
                    <td className="py-2.5"><StatusBadge status={reg.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="rounded-card bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Monthly Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <MiniStat label="Deals This Month" value={stats.dealsThisMonth.toString()} />
            <MiniStat label="Revenue This Month" value={`$${stats.revenueThisMonth.toLocaleString()}`} />
            <MiniStat label="Flagged Accounts" value={stats.flaggedAccounts.toString()} variant="warning" />
            <MiniStat label="Pending Moderation" value={stats.pendingModeration.toString()} variant="warning" />
          </div>
        </div>
      </div>

      {/* Row 4: Moderation Alerts */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Moderation Alerts</h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {stats.moderationQueue.map((item) => (
            <div key={item.id} className="rounded-card bg-white p-6 shadow-card">
              <div className="mb-3 flex items-start justify-between">
                <h4 className="font-semibold text-gray-800">
                  {"creatorName" in item ? (item as Record<string, unknown>).creatorName as string : (item as Record<string, unknown>).accountName as string}
                </h4>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${severityBadge[item.severity]}`}>
                  {item.severity}
                </span>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-gray-600">{item.reason}</p>
              <div className="mb-4 flex items-center gap-3 text-xs text-gray-400">
                <span>{formatDate(item.flaggedAt)}</span>
                <span className="capitalize">{item.type.replace(/_/g, " ")}</span>
              </div>
              <div className="flex gap-2">
                <button className="rounded-button border border-brand-primary px-3 py-1.5 text-xs font-medium text-brand-primary hover:bg-brand-50">
                  Review
                </button>
                <button className="rounded-button border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50">
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, growth }: { label: string; value: string; growth?: string }) {
  return (
    <div className="rounded-card bg-white p-6 shadow-card">
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
      {growth && <p className="mt-2 text-xs font-medium text-green-600">{growth}</p>}
    </div>
  );
}

function MiniStat({ label, value, variant }: { label: string; value: string; variant?: "warning" }) {
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <p className={`text-2xl font-bold ${variant === "warning" ? "text-orange-600" : "text-gray-800"}`}>{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  );
}
