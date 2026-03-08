"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/session";
import { upsertCreatorProfile } from "@/lib/data";

export async function saveCreatorSettings(formData: FormData) {
  const session = await requireRole("creator");

  const name = formData.get("name") as string | null;
  const handle = formData.get("handle") as string | null;
  const bio = formData.get("bio") as string | null;
  const platform = (formData.get("platform") as string) || "youtube";
  const channelUrl = formData.get("channelUrl") as string | null;
  const minimumDealSize = formData.get("minimumDealSize") as string | null;
  const availabilityStatus = (formData.get("availabilityStatus") as string) || "open";
  const publicProfileUrl = formData.get("publicProfileUrl") as string | null;

  const categoriesRaw = formData.get("categories") as string | null;
  const nicheTagsRaw = formData.get("nicheTags") as string | null;
  const openCatsRaw = formData.get("brandPreferencesOpen") as string | null;
  const blockedCatsRaw = formData.get("brandPreferencesBlocked") as string | null;

  const categories = categoriesRaw ? JSON.parse(categoriesRaw) as string[] : [];
  const nicheTags = nicheTagsRaw ? JSON.parse(nicheTagsRaw) as string[] : [];
  const brandPreferencesOpen = openCatsRaw ? JSON.parse(openCatsRaw) as string[] : [];
  const brandPreferencesBlocked = blockedCatsRaw ? JSON.parse(blockedCatsRaw) as string[] : [];

  await upsertCreatorProfile({
    user_id: session.id,
    name: name || session.fullName || "Creator",
    handle: handle || "",
    bio: bio || null,
    platform: platform as "youtube" | "twitch",
    channel_url: channelUrl || null,
    minimum_deal_size: minimumDealSize ? parseInt(minimumDealSize, 10) : 0,
    availability_status: availabilityStatus as "open" | "limited" | "closed",
    public_profile_url: publicProfileUrl || null,
    categories,
    niche_tags: nicheTags,
    brand_preferences_open: brandPreferencesOpen,
    brand_preferences_blocked: brandPreferencesBlocked,
  });

  revalidatePath("/creator/settings");
  revalidatePath("/creator");
}
