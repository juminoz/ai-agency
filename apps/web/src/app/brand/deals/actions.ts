"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/session";
import {
  getBrandByUserId,
  getDealById,
  sendDealMessage,
  updateDealStatus,
} from "@/lib/data";

export async function respondToDeal(formData: FormData) {
  const session = await requireRole("brand");
  const dealId = formData.get("dealId") as string;
  const action = formData.get("action") as string;
  const message = (formData.get("message") as string)?.trim();

  if (!dealId || !action) throw new Error("Missing dealId or action");

  const brand = await getBrandByUserId(session.id);
  if (!brand) throw new Error("Brand profile required");

  const deal = await getDealById(dealId);
  if (!deal || deal.brand_id !== brand.id) throw new Error("Unauthorized");

  let newStatus: typeof deal.status;
  let autoMessage: string;

  switch (action) {
    case "accept":
      newStatus = "negotiating";
      autoMessage = message || "Thanks for your interest! I'd love to discuss a collaboration. Let's work out the details.";
      break;
    case "decline":
      newStatus = "declined";
      autoMessage = message || "Thank you for reaching out, but this isn't a good fit right now. Best of luck!";
      break;
    default:
      throw new Error("Invalid action");
  }

  await updateDealStatus(dealId, newStatus);

  await sendDealMessage({
    deal_id: dealId,
    sender_type: "brand",
    sender_name: brand.name,
    text: autoMessage,
  });

  revalidatePath("/brand/deals");
  revalidatePath("/brand/messages");
  revalidatePath("/creator/deals");
  revalidatePath("/creator/brands");

  return { success: true };
}

export async function sendBrandMessage(formData: FormData) {
  const session = await requireRole("brand");
  const dealId = formData.get("dealId") as string;
  const text = (formData.get("text") as string)?.trim();

  if (!dealId || !text) throw new Error("Missing dealId or text");

  const brand = await getBrandByUserId(session.id);
  if (!brand) throw new Error("Brand profile required");

  const deal = await getDealById(dealId);
  if (!deal || deal.brand_id !== brand.id) throw new Error("Unauthorized");

  await sendDealMessage({
    deal_id: dealId,
    sender_type: "brand",
    sender_name: brand.name,
    text,
  });

  revalidatePath("/brand/deals");
  revalidatePath("/brand/messages");

  return { success: true };
}
