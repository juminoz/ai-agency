"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/session";
import { upsertCreatorProfile } from "@/lib/data";

export async function saveCreatorProfile(
  _prevState: unknown,
  formData: FormData,
) {
  const session = await requireRole("creator");

  const bio = formData.get("bio") as string | null;
  const minimumDealSize = Number(formData.get("minimumDealSize")) || 0;
  const availabilityStatus = formData.get("availabilityStatus") as string ?? "open";
  const categoriesRaw = formData.get("categories") as string | null;
  const nicheTagsRaw = formData.get("nicheTags") as string | null;
  const openToRaw = formData.get("brandPreferencesOpen") as string | null;
  const blockedRaw = formData.get("brandPreferencesBlocked") as string | null;
  const publicProfileUrl = formData.get("publicProfileUrl") as string | null;
  const channelUrl = formData.get("channelUrl") as string | null;
  const handle = formData.get("handle") as string | null;
  const name = formData.get("name") as string | null;
  const platform = formData.get("platform") as string | null;

  const categories = categoriesRaw ? JSON.parse(categoriesRaw) as string[] : [];
  const nicheTags = nicheTagsRaw ? JSON.parse(nicheTagsRaw) as string[] : [];
  const openTo = openToRaw ? JSON.parse(openToRaw) as string[] : [];
  const blocked = blockedRaw ? JSON.parse(blockedRaw) as string[] : [];

  await upsertCreatorProfile({
    user_id: session.id,
    handle: handle || session.email.split("@")[0],
    name: name || session.fullName || "Creator",
    bio: bio || null,
    platform: (platform as "youtube" | "twitch") || "youtube",
    minimum_deal_size: minimumDealSize,
    availability_status: availabilityStatus as "open" | "limited" | "closed",
    categories,
    niche_tags: nicheTags,
    brand_preferences_open: openTo,
    brand_preferences_blocked: blocked,
    public_profile_url: publicProfileUrl || null,
    channel_url: channelUrl || null,
  });

  revalidatePath("/creator/profile");
  revalidatePath("/creator");

  return { success: true };
}
