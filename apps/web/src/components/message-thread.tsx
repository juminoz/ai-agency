"use client";

import { useState } from "react";

interface Message {
  id: string;
  sender: string;
  senderName: string;
  text: string;
  timestamp: string;
}

interface MessageThreadProps {
  messages: Message[];
  currentUserType: "creator" | "brand";
}

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }) +
    " at " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
}

export function MessageThread({ messages, currentUserType }: MessageThreadProps) {
  const [draft, setDraft] = useState("");

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <svg className="mb-3 h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-sm">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Message list */}
      <div className="flex flex-col gap-3 px-1 py-4">
        {messages.map((msg) => {
          const isCurrentUser = msg.sender === currentUserType;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}
            >
              {/* Sender name */}
              <span className="mb-1 px-1 text-xs font-medium text-gray-500">
                {msg.senderName}
              </span>

              {/* Bubble */}
              <div
                className={`relative max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isCurrentUser
                    ? "rounded-br-md bg-brand-primary text-white"
                    : "rounded-bl-md bg-surface-100 text-gray-700"
                }`}
              >
                {msg.text}
              </div>

              {/* Timestamp */}
              <span className="mt-1 px-1 text-[11px] text-gray-400">
                {formatTimestamp(msg.timestamp)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Message input */}
      <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
        />
        <button
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white transition-colors hover:bg-brand-500 disabled:opacity-40"
          disabled={!draft.trim()}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
