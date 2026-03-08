import { MessagesView } from "@/components/messages-view";
import { requireRole } from "@/lib/auth/session";
import { getBrandByUserId, getCreatorById, getDealMessages, getDeals } from "@/lib/data";

export default async function BrandMessagesPage() {
  const session = await requireRole("brand");
  const brand = await getBrandByUserId(session.id);
  if (!brand) return <p className="p-8 text-gray-500">Brand profile not found.</p>;

  const deals = await getDeals({ brandId: brand.id });

  // Fetch messages + creator names for all deals in parallel
  const threads = await Promise.all(
    deals.map(async (deal) => {
      const [messages, creator] = await Promise.all([
        getDealMessages(deal.id),
        getCreatorById(deal.creator_id),
      ]);
      return {
        deal,
        messages,
        counterpartyName: creator?.name ?? "Unknown Creator",
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

  return <MessagesView role="brand" threads={activeThreads} />;
}
