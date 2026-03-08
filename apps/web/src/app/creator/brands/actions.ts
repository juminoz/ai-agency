"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/session";
import {
  findOrCreateDeal,
  getCreatorByUserId,
  sendDealMessage,
} from "@/lib/data";

export async function signalInterest(formData: FormData) {
  const session = await requireRole("creator");
  const brandId = formData.get("brandId") as string;
  const brandName = formData.get("brandName") as string;
  const message = (formData.get("message") as string)?.trim();

  if (!brandId) throw new Error("Missing brandId");

  const creator = await getCreatorByUserId(session.id);
  if (!creator) throw new Error("Creator profile required");

  const deal = await findOrCreateDeal({
    brandId,
    creatorId: creator.id,
    briefTitle: `Interest from ${creator.name}`,
  });

  // Send intro message if provided or default
  const text =
    message ||
    `Hi ${brandName}! I'm interested in working together. I think my audience would be a great fit for your brand.`;

  await sendDealMessage({
    deal_id: deal.id,
    sender_type: "creator",
    sender_name: creator.name,
    text,
  });

  revalidatePath("/creator/brands");
  revalidatePath("/brand/deals");
  revalidatePath("/brand/messages");

  return { success: true, dealId: deal.id };
}
