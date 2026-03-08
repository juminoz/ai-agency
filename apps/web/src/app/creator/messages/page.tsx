import { MessagesView } from "@/components/messages-view";
import { requireRole } from "@/lib/auth/session";
import { getDeals, getDealMessages, getCreatorByUserId, getBrandById } from "@/lib/data";

export default async function CreatorMessagesPage() {
  const session = await requireRole("creator");
  const creator = await getCreatorByUserId(session.id);
  if (!creator) return <p className="p-8 text-gray-500">Creator profile not found.</p>;

  const deals = await getDeals({ creatorId: creator.id });

  // Fetch messages + brand names for all deals in parallel
  const threads = await Promise.all(
    deals.map(async (deal) => {
      const [messages, brand] = await Promise.all([
        getDealMessages(deal.id),
        getBrandById(deal.brand_id),
      ]);
      return {
        deal,
        messages,
        counterpartyName: brand?.name ?? "Unknown Brand",
      };
    }),
  );

  // Only show deals that have messages, sorted by most recent
  const activeThreads = threads
    .filter((t) => t.messages.length > 0)
    .sort((a, b) => {
      const aLast = a.messages[a.messages.length - 1].sent_at;
      const bLast = b.messages[b.messages.length - 1].sent_at;
      return new Date(bLast).getTime() - new Date(aLast).getTime();
    });

  return <MessagesView role="creator" threads={activeThreads} />;
}
