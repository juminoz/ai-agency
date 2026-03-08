import { CreatorSearch } from "@/components/creator-search";
import creators from "@/data/mock/creators.json";

export default function BrandSearchPage() {
  return <CreatorSearch creators={creators} />;
}
