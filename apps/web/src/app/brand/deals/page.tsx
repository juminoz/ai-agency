import { requireRole } from "@/lib/auth/session";
import { getBrandByUserId, getDealMessages, getDealsWithNames } from "@/lib/data";

import { BrandDealsClient } from "./deals-client";

export default async function BrandDealsPage() {
  const session = await requireRole("brand");
  const brand = await getBrandByUserId(session.id);

  if (!brand) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <p className="text-sm text-gray-500">
          Please{" "}
          <a href="/brand/settings" className="text-brand-primary underline">
            set up your brand profile
          </a>{" "}
          first to see deals.
        </p>
      </div>
    );
  }

  const deals = await getDealsWithNames({ brandId: brand.id });

  // Fetch messages for all deals
  const dealsWithMessages = await Promise.all(
    deals.map(async (deal) => {
      const messages = await getDealMessages(deal.id);
      return { ...deal, messages };
    }),
  );

  return <BrandDealsClient deals={dealsWithMessages} />;
}
