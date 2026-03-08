import { CreatorSearch } from "@/components/creator-search";
import {
  creatorProfileToView,
  getCreators,
  getCreatorVideos,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function BrandSearchPage() {
  const profiles = await getCreators();

  // Fetch videos for each creator so the cards can show avg views
  const creators = await Promise.all(
    profiles.map(async (p) => {
      const videos = await getCreatorVideos(p.id);
      return creatorProfileToView(p, videos);
    })
  );

  return <CreatorSearch creators={creators} />;
}
