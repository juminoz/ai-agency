"use client";

import { MessageSquare, X } from "lucide-react";
import { useState, useTransition } from "react";

import { respondToDeal, sendBrandMessage } from "./actions";

import type { Deal, DealMessage } from "@/lib/supabase/types";

type DealWithNames = Deal & {
  brand_name: string;
  creator_name: string;
  messages: DealMessage[];
};

interface Props {
  deals: DealWithNames[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

type FilterTab = "all" | "received" | "active" | "completed";

const TAB_FILTERS: Record<FilterTab, (d: DealWithNames) => boolean> = {
  all: () => true,
  received: (d) => d.status === "received",
  active: (d) => ["negotiating", "agreed", "live"].includes(d.status),
  completed: (d) => ["completed", "reviewed", "declined", "cancelled"].includes(d.status),
};

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  received: { bg: "bg-blue-100", text: "text-blue-600", label: "New Interest" },
  negotiating: { bg: "bg-amber-100", text: "text-amber-600", label: "Negotiating" },
  agreed: { bg: "bg-green-100", text: "text-green-600", label: "Agreed" },
  live: { bg: "bg-purple-100", text: "text-purple-600", label: "Live" },
  completed: { bg: "bg-gray-100", text: "text-gray-600", label: "Completed" },
  reviewed: { bg: "bg-accent-100", text: "text-accent-primary", label: "Reviewed" },
  declined: { bg: "bg-red-100", text: "text-red-600", label: "Declined" },
  cancelled: { bg: "bg-gray-100", text: "text-gray-500", label: "Cancelled" },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return (
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " at " +
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
}

/* ------------------------------------------------------------------ */
/*  Deal Card                                                          */
/* ------------------------------------------------------------------ */

function DealCard({
  deal,
  isSelected,
  onSelect,
}: {
  deal: DealWithNames;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const statusStyle = STATUS_STYLES[deal.status] ?? STATUS_STYLES.received;
  const lastMsg = deal.messages.length > 0 ? deal.messages[deal.messages.length - 1] : null;

  return (
    <button
      onClick={() => onSelect(deal.id)}
      className={`w-full rounded-card bg-white p-4 text-left shadow-card transition-all hover:shadow-card-hover ${
        isSelected ? "ring-2 ring-brand-primary" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-100 text-sm font-bold text-brand-primary">
          {deal.creator_name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="truncate text-sm font-semibold text-gray-800">
              {deal.creator_name}
            </h4>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
            >
              {statusStyle.label}
            </span>
          </div>
          <p className="mt-0.5 truncate text-sm text-gray-700">
            {deal.brief_title || "Direct Interest"}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
            <span>{formatDate(deal.created_at)}</span>
            {deal.messages.length > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" /> {deal.messages.length}
              </span>
            )}
          </div>
          {lastMsg && (
            <p className="mt-2 line-clamp-1 text-xs text-gray-400">
              <span className="font-medium text-gray-500">{lastMsg.sender_name}:</span>{" "}
              {lastMsg.text}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Deal Detail Panel                                                  */
/* ------------------------------------------------------------------ */

function DealDetail({
  deal,
  onClose,
  onRespond,
}: {
  deal: DealWithNames;
  onClose: () => void;
  onRespond: () => void;
}) {
  const statusStyle = STATUS_STYLES[deal.status] ?? STATUS_STYLES.received;
  const [responseMessage, setResponseMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleRespond(action: "accept" | "decline") {
    const formData = new FormData();
    formData.set("dealId", deal.id);
    formData.set("action", action);
    if (responseMessage.trim()) formData.set("message", responseMessage);
    startTransition(async () => {
      await respondToDeal(formData);
      onRespond();
    });
  }

  function handleSendMessage() {
    if (!newMessage.trim()) return;
    const formData = new FormData();
    formData.set("dealId", deal.id);
    formData.set("text", newMessage);
    startTransition(async () => {
      await sendBrandMessage(formData);
      setNewMessage("");
      onRespond();
    });
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-100 text-sm font-bold text-brand-primary">
            {deal.creator_name.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">{deal.creator_name}</h3>
            <p className="text-xs text-gray-500">{deal.brief_title || "Direct Interest"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
          >
            {statusStyle.label}
          </span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Deal info */}
        <div className="mb-5 rounded-card bg-surface-50 p-4">
          <h4 className="mb-3 text-sm font-semibold text-gray-700">Deal Info</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500">Creator</p>
              <p className="font-medium text-gray-700">{deal.creator_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className="font-medium capitalize text-gray-700">{deal.status}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Created</p>
              <p className="font-medium text-gray-700">{formatDate(deal.created_at)}</p>
            </div>
            {deal.match_score && (
              <div>
                <p className="text-xs text-gray-500">Match Score</p>
                <p className="font-medium text-gray-700">{deal.match_score}%</p>
              </div>
            )}
          </div>
          {deal.agreed_rate && (
            <div className="mt-3 border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-500">Agreed Rate</p>
              <p className="text-lg font-bold text-green-600">
                ${deal.agreed_rate.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Response actions for new interest */}
        {deal.status === "received" && (
          <div className="mb-5 rounded-card border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 text-sm font-semibold text-blue-800">
              New Interest from {deal.creator_name}
            </h4>
            <p className="mb-3 text-xs text-blue-600">
              This creator wants to work with you. Accept to start negotiating, or decline.
            </p>
            <textarea
              className="mb-3 w-full resize-none rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              rows={3}
              placeholder="Add a response message (optional)..."
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleRespond("accept")}
                disabled={isPending}
                className="flex-1 rounded-button bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-500 disabled:opacity-50"
              >
                {isPending ? "..." : "Accept & Start Negotiating"}
              </button>
              <button
                onClick={() => handleRespond("decline")}
                disabled={isPending}
                className="rounded-button border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-700">Messages</h4>
          {deal.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <MessageSquare className="mb-2 h-8 w-8" />
              <p className="text-sm">No messages yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 py-2">
              {deal.messages.map((msg) => {
                const isMe = msg.sender_type === "brand";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <span className="mb-1 px-1 text-xs font-medium text-gray-500">
                      {msg.sender_name || msg.sender_type}
                    </span>
                    <div
                      className={`relative max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isMe
                          ? "rounded-br-md bg-brand-primary text-white"
                          : "rounded-bl-md bg-surface-100 text-gray-700"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="mt-1 px-1 text-[11px] text-gray-400">
                      {formatTime(msg.sent_at)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Message input for active deals */}
          {!["declined", "cancelled", "completed", "reviewed"].includes(deal.status) && (
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isPending}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white transition-colors hover:bg-brand-500 disabled:opacity-40"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export function BrandDealsClient({ deals }: Props) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  const filteredDeals = deals.filter(TAB_FILTERS[activeTab]);
  const selectedDeal = deals.find((d) => d.id === selectedDealId) ?? null;

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "received", label: "New Interest" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
  ];

  const receivedCount = deals.filter((d) => d.status === "received").length;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Notification banner for new interests */}
      {receivedCount > 0 && (
        <div className="flex items-center gap-3 rounded-card bg-blue-50 px-5 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-sm text-blue-800">
            You have <span className="font-semibold">{receivedCount} new interest signal{receivedCount !== 1 ? "s" : ""}</span> from creators waiting for your response.
          </p>
          <button
            onClick={() => setActiveTab("received")}
            className="ml-auto rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
          >
            View
          </button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-card bg-white p-1 shadow-card">
        {tabs.map((tab) => {
          const count = deals.filter(TAB_FILTERS[tab.key]).length;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSelectedDealId(null);
              }}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-primary text-white"
                  : "text-gray-500 hover:bg-surface-100 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content area */}
      <div className="flex min-h-0 flex-1 gap-4">
        {/* Deal list */}
        <div
          className={`flex flex-col gap-3 overflow-y-auto ${
            selectedDeal ? "w-2/5" : "w-full"
          } transition-all`}
        >
          {filteredDeals.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-card bg-white p-12 shadow-card">
              <p className="text-sm text-gray-400">
                {activeTab === "received"
                  ? "No new interest signals"
                  : "No deals in this category"}
              </p>
            </div>
          ) : (
            filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                isSelected={selectedDealId === deal.id}
                onSelect={setSelectedDealId}
              />
            ))
          )}
        </div>

        {/* Detail panel */}
        {selectedDeal && (
          <div className="w-3/5">
            <DealDetail
              deal={selectedDeal}
              onClose={() => setSelectedDealId(null)}
              onRespond={() => {
                // Page will revalidate via server action
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
