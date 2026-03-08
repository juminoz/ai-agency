import { BrandDealsClient } from "./deals-client";

import { requireRole } from "@/lib/auth/session";
import {
  getBrandByUserId,
  getDealMessages,
  getDealsWithNames,
} from "@/lib/data";


export default async function BrandDealsPage() {
  const session = await requireRole("brand");
  const brand = await getBrandByUserId(session.id);

  if (!brand) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <p className="text-sm text-gray-500">
          Please{" "}
          <a className="text-brand-primary underline" href="/brand/settings">
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
    })
  );

  return <BrandDealsClient deals={dealsWithMessages} />;
}
