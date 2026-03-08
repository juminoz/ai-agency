"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/auth/session";
import { getBrandByUserId, getCreatorByUserId, getDealById, sendDealMessage } from "@/lib/data";

export async function sendMessageAction(formData: FormData) {
  const session = await requireSession();
  const dealId = formData.get("dealId") as string;
  const text = (formData.get("text") as string)?.trim();

  if (!dealId || !text) throw new Error("Missing dealId or text");

  const deal = await getDealById(dealId);
  if (!deal) throw new Error("Deal not found");

  // Determine sender info based on role
  let senderType: "brand" | "creator";
  let senderName: string | null = null;

  if (session.subtype === "brand") {
    const brand = await getBrandByUserId(session.id);
    if (!brand || brand.id !== deal.brand_id) throw new Error("Unauthorized");
    senderType = "brand";
    senderName = brand.name;
  } else if (session.subtype === "creator") {
    const creator = await getCreatorByUserId(session.id);
    if (!creator || creator.id !== deal.creator_id) throw new Error("Unauthorized");
    senderType = "creator";
    senderName = creator.name;
  } else {
    throw new Error("Invalid role");
  }

  await sendDealMessage({
    deal_id: dealId,
    sender_type: senderType,
    sender_name: senderName,
    text,
  });

  revalidatePath("/brand/messages");
  revalidatePath("/creator/messages");
}
