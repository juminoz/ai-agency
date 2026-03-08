import { MessageSquare } from "lucide-react";

import { getDeals, getDealMessages } from "@/lib/data";

const BRAND_ID = "brand-1";

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function BrandMessagesPage() {
  const deals = await getDeals({ brandId: BRAND_ID });

  // Fetch messages for all deals in parallel
  const dealsWithMessages = await Promise.all(
    deals.map(async (deal) => {
      const messages = await getDealMessages(deal.id);
      return { deal, messages };
    }),
  );

  // Only show deals that have messages, sorted by most recent message
  const activeThreads = dealsWithMessages
    .filter((d) => d.messages.length > 0)
    .sort((a, b) => {
      const aLast = a.messages[a.messages.length - 1].sent_at;
      const bLast = b.messages[b.messages.length - 1].sent_at;
      return new Date(bLast).getTime() - new Date(aLast).getTime();
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        <p className="mt-1 text-sm text-gray-500">
          Conversations with creators across your deals.
        </p>
      </div>

      {activeThreads.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-card bg-white p-16 shadow-card">
          <MessageSquare className="mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">No messages yet</p>
          <p className="mt-1 text-xs text-gray-400">
            Messages will appear here when you start deals with creators.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeThreads.map(({ deal, messages }) => {
            const lastMessage = messages[messages.length - 1];
            const unread = messages.filter(
              (m) => m.sender_type === "creator",
            ).length;

            return (
              <div
                key={deal.id}
                className="group rounded-card bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-100 text-sm font-bold text-brand-primary">
                    {(deal.brief_title ?? "D").charAt(0)}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-800">
                          {deal.brief_title ?? "Untitled Deal"}
                        </h3>
                        {unread > 0 && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
                            {unread}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {timeAgo(lastMessage.sent_at)}
                      </span>
                    </div>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Deal status:{" "}
                      <span className="capitalize font-medium text-gray-600">
                        {deal.status}
                      </span>
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      <span className="font-medium text-gray-700">
                        {lastMessage.sender_name ?? lastMessage.sender_type}:
                      </span>{" "}
                      {lastMessage.text}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {messages.length} message{messages.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
