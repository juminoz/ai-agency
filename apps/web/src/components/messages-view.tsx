"use client";

import { MessageSquare, ArrowLeft, Send } from "lucide-react";
import { useOptimistic, useRef, useState, useTransition } from "react";

import type { Deal, DealMessage } from "@/lib/supabase/types";

import { sendMessageAction } from "@/app/messages/actions";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Thread {
  deal: Deal;
  messages: DealMessage[];
  counterpartyName: string;
}

interface MessagesViewProps {
  threads: Thread[];
  role: "creator" | "brand";
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  return (
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " at " +
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
}

/* ------------------------------------------------------------------ */
/*  Thread list item                                                   */
/* ------------------------------------------------------------------ */

function ThreadItem({
  thread,
  role,
  isSelected,
  onSelect,
}: {
  thread: Thread;
  role: "creator" | "brand";
  isSelected: boolean;
  onSelect: () => void;
}) {
  const lastMessage = thread.messages[thread.messages.length - 1];
  const otherRole = role === "brand" ? "creator" : "brand";
  const unread = thread.messages.filter((m) => m.sender_type === otherRole).length;

  return (
    <button
      className={`w-full rounded-card bg-white p-4 text-left shadow-card transition-all hover:shadow-card-hover ${
        isSelected ? "ring-2 ring-brand-primary" : ""
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-100 text-sm font-bold text-brand-primary">
          {thread.counterpartyName.charAt(0)}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800 truncate">
                {thread.counterpartyName}
              </span>
              {unread > 0 && (
                <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-primary px-1 text-xs font-bold text-white">
                  {unread}
                </span>
              )}
            </div>
            <span className="shrink-0 text-xs text-gray-400">
              {timeAgo(lastMessage.sent_at)}
            </span>
          </div>

          <p className="mt-0.5 text-xs text-gray-500">
            {thread.deal.brief_title ?? "Untitled Deal"}{" "}
            <span className="capitalize font-medium text-gray-500">
              · {thread.deal.status}
            </span>
          </p>

          <p className="mt-1.5 line-clamp-1 text-sm text-gray-600">
            <span className="font-medium text-gray-700">
              {lastMessage.sender_type === role ? "You" : lastMessage.sender_name ?? lastMessage.sender_type}:
            </span>{" "}
            {lastMessage.text}
          </p>
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Conversation detail                                                */
/* ------------------------------------------------------------------ */

function ConversationDetail({
  thread,
  role,
  onBack,
}: {
  thread: Thread;
  role: "creator" | "brand";
  onBack: () => void;
}) {
  const [optimisticMessages, addOptimistic] = useOptimistic(
    thread.messages,
    (state: DealMessage[], newMsg: DealMessage) => [...state, newMsg],
  );
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  function handleSubmit(formData: FormData) {
    const text = (formData.get("text") as string)?.trim();
    if (!text) return;

    // Optimistic update
    addOptimistic({
      id: `temp-${Date.now()}`,
      deal_id: thread.deal.id,
      sender_type: role,
      sender_name: "You",
      text,
      sent_at: new Date().toISOString(),
    });

    formRef.current?.reset();
    inputRef.current?.focus();

    // Scroll to bottom
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 50);

    startTransition(async () => {
      const fd = new FormData();
      fd.set("dealId", thread.deal.id);
      fd.set("text", text);
      await sendMessageAction(fd);
    });
  }

  return (
    <div className="flex h-full flex-col rounded-card bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 md:hidden"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-100 text-sm font-bold text-brand-primary">
          {thread.counterpartyName.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {thread.counterpartyName}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {thread.deal.brief_title ?? "Untitled Deal"} · <span className="capitalize">{thread.deal.status}</span>
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-col gap-3">
          {optimisticMessages.map((msg) => {
            const isCurrentUser = msg.sender_type === role;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}
              >
                <span className="mb-1 px-1 text-xs font-medium text-gray-500">
                  {isCurrentUser ? "You" : msg.sender_name ?? msg.sender_type}
                </span>
                <div
                  className={`relative max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isCurrentUser
                      ? "rounded-br-md bg-brand-primary text-white"
                      : "rounded-bl-md bg-surface-100 text-gray-700"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="mt-1 px-1 text-[11px] text-gray-400">
                  {formatTimestamp(msg.sent_at)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 px-5 py-3">
        <form
          ref={formRef}
          action={handleSubmit}
          className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2"
        >
          <input
            ref={inputRef}
            autoComplete="off"
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            name="text"
            placeholder="Type a message..."
            type="text"
          />
          <button
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white transition-colors hover:bg-brand-500 disabled:opacity-40"
            disabled={isPending}
            type="submit"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main view                                                          */
/* ------------------------------------------------------------------ */

export function MessagesView({ threads, role }: MessagesViewProps) {
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const selectedThread = threads.find((t) => t.deal.id === selectedDealId) ?? null;

  if (threads.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
          <p className="mt-1 text-sm text-gray-500">
            {role === "brand"
              ? "Conversations with creators across your deals."
              : "Conversations with brands across your deals."}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-card bg-white p-16 shadow-card">
          <MessageSquare className="mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">No messages yet</p>
          <p className="mt-1 text-xs text-gray-400">
            Messages will appear here when you have active deals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        <p className="mt-1 text-sm text-gray-500">
          {role === "brand"
            ? "Conversations with creators across your deals."
            : "Conversations with brands across your deals."}
        </p>
      </div>

      {/* Two-panel layout */}
      <div className="flex min-h-0 flex-1 gap-4">
        {/* Thread list */}
        <div
          className={`flex flex-col gap-2 overflow-y-auto ${
            selectedThread ? "hidden md:flex md:w-2/5" : "w-full"
          } transition-all`}
        >
          {threads.map((thread) => (
            <ThreadItem
              key={thread.deal.id}
              isSelected={selectedDealId === thread.deal.id}
              role={role}
              thread={thread}
              onSelect={() => setSelectedDealId(thread.deal.id)}
            />
          ))}
        </div>

        {/* Conversation detail */}
        {selectedThread ? (
          <div className={`${selectedThread ? "flex-1" : "hidden"} min-h-0`}>
            <ConversationDetail
              role={role}
              thread={selectedThread}
              onBack={() => setSelectedDealId(null)}
            />
          </div>
        ) : (
          <div className="hidden flex-1 items-center justify-center rounded-card bg-white shadow-card md:flex">
            <div className="text-center">
              <MessageSquare className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-400">Select a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
