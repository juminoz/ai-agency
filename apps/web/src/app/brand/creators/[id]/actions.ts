"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/session";
import { findOrCreateDeal, getBrandByUserId, sendDealMessage } from "@/lib/data";

export async function startConversationAction(
  _prevState: { sent: boolean; error?: string },
  formData: FormData,
) {
  const creatorId = formData.get("creatorId") as string;
  const text = (formData.get("text") as string)?.trim();

  if (!creatorId || !text) {
    return { sent: false, error: "Please enter a message." };
  }

  try {
    const session = await requireRole("brand");
    const brand = await getBrandByUserId(session.id);
    if (!brand) {
      return { sent: false, error: "Brand profile not found. Please set up your brand in Settings first." };
    }

    const deal = await findOrCreateDeal({
      brandId: brand.id,
      creatorId,
    });

    await sendDealMessage({
      deal_id: deal.id,
      sender_type: "brand",
      sender_name: brand.name,
      text,
    });

    revalidatePath(`/brand/creators/${creatorId}`);
    revalidatePath("/brand/messages");

    return { sent: true };
  } catch (e) {
    return { sent: false, error: (e as Error).message };
  }
}
