"use client";

interface Deal {
  id: string;
  brandId: string;
  creatorId: string;
  brandName: string;
  brandLogo: string;
  creatorName: string;
  creatorAvatar: string;
  status: string;
  brief: {
    title: string;
    budget: { min: number; max: number };
    format: string;
    timeline: string;
    goal: string;
    deliverables: string;
    exclusivity: { category: string; window: string } | null;
  };
  matchScore: number;
  createdAt: string;
  agreedRate?: number;
  campaignUrl?: string;
  performance?: {
    projectedViews: number;
    actualViews: number;
    projectedEngagements: number;
    actualEngagements: number;
    daysLive: number;
    status: string;
  };
  review?: {
    brandReview: { delivery: number; communication: number; overall: number; note: string };
    creatorReview: { delivery: number; communication: number; overall: number; note: string };
  };
  messages: {
    id: string;
    sender: string;
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

interface DealCardProps {
  deal: Deal;
  viewAs: "creator" | "brand";
  isSelected: boolean;
  onSelect: (dealId: string) => void;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  received: { bg: "bg-blue-100", text: "text-blue-600", label: "Received" },
  negotiating: { bg: "bg-amber-100", text: "text-amber-600", label: "Negotiating" },
  agreed: { bg: "bg-green-100", text: "text-green-600", label: "Agreed" },
  live: { bg: "bg-purple-100", text: "text-purple-600", label: "Live" },
  completed: { bg: "bg-gray-100", text: "text-gray-600", label: "Completed" },
  reviewed: { bg: "bg-accent-100", text: "text-accent-primary", label: "Reviewed" },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export type { Deal };

export function DealCard({ deal, viewAs, isSelected, onSelect }: DealCardProps) {
  const statusStyle = STATUS_STYLES[deal.status] ?? STATUS_STYLES.received;
  const counterpartyName = viewAs === "creator" ? deal.brandName : deal.creatorName;
  const counterpartyInitial = counterpartyName.charAt(0);
  const lastMessage = deal.messages.length > 0 ? deal.messages[deal.messages.length - 1] : null;
  const budgetDisplay =
    deal.brief.budget.min === deal.brief.budget.max
      ? `$${deal.brief.budget.min.toLocaleString()}`
      : `$${deal.brief.budget.min.toLocaleString()} - $${deal.brief.budget.max.toLocaleString()}`;

  return (
    <button
      onClick={() => onSelect(deal.id)}
      className={`w-full rounded-card bg-white p-4 text-left shadow-card transition-all hover:shadow-card-hover ${
        isSelected ? "ring-2 ring-brand-primary" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-100 text-sm font-bold text-brand-primary">
          {counterpartyInitial}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Top row: name + status */}
          <div className="flex items-center justify-between gap-2">
            <h4 className="truncate text-sm font-semibold text-gray-800">
              {counterpartyName}
            </h4>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
            >
              {statusStyle.label}
            </span>
          </div>

          {/* Title */}
          <p className="mt-0.5 truncate text-sm text-gray-700">{deal.brief.title}</p>

          {/* Meta row */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="font-medium text-gray-600">{budgetDisplay}</span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {deal.matchScore}% match
            </span>
            <span>{formatDate(deal.createdAt)}</span>
          </div>

          {/* Last message preview */}
          {lastMessage && (
            <p className="mt-2 line-clamp-1 text-xs text-gray-400">
              <span className="font-medium text-gray-500">{lastMessage.senderName}:</span>{" "}
              {lastMessage.text}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
