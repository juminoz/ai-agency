import Link from "next/link";

<<<<<<< Updated upstream
import { CreatorDetailView } from "@/components/creator-detail-view";
import {
  creatorProfileToView,
  getCreatorById,
  getCreatorVideos,
} from "@/lib/data";

export const dynamic = "force-dynamic";
=======
import { requireRole } from "@/lib/auth/session";
import {
  getBrandByUserId,
  getCreatorById,
  getCreatorVideos,
  getDealMessages,
  getDeals,
} from "@/lib/data";

import { CreatorDetail } from "./creator-detail";
>>>>>>> Stashed changes

export default async function BrandCreatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
<<<<<<< Updated upstream
  const profile = await getCreatorById(id);

  if (!profile) {
=======
  const session = await requireRole("brand");

  const creator = await getCreatorById(id);

  if (!creator) {
>>>>>>> Stashed changes
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-card bg-white p-12 text-center shadow-card">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
<<<<<<< Updated upstream
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
=======
            <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
>>>>>>> Stashed changes
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Creator Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            No creator with this ID was found.
          </p>
          <Link
            className="mt-4 inline-block rounded-button bg-brand-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-500"
            href="/brand/search"
          >
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

<<<<<<< Updated upstream
  const videos = await getCreatorVideos(id);
  const creator = creatorProfileToView(profile, videos);

  return <CreatorDetailView creator={creator} />;
=======
  // Fetch videos, brand profile, and existing deal messages in parallel
  const brand = await getBrandByUserId(session.id);
  const [videos, deals] = await Promise.all([
    getCreatorVideos(creator.id),
    brand ? getDeals({ brandId: brand.id, creatorId: creator.id }) : Promise.resolve([]),
  ]);

  // Get messages from existing deals with this creator
  let existingMessages: Awaited<ReturnType<typeof getDealMessages>> = [];
  if (deals.length > 0) {
    const allMessages = await Promise.all(deals.map((d) => getDealMessages(d.id)));
    existingMessages = allMessages.flat().sort(
      (a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime(),
    );
  }

  return (
    <CreatorDetail
      creator={creator}
      existingMessages={existingMessages}
      videos={videos}
    />
  );
>>>>>>> Stashed changes
}
