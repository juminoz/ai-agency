"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/session";
import { upsertBrand } from "@/lib/data";

export async function saveBrandSettings(
  _prevState: unknown,
  formData: FormData,
) {
  const session = await requireRole("brand");

  const name = formData.get("name") as string | null;
  const category = formData.get("category") as string | null;
  const description = formData.get("description") as string | null;
  const targetAgeRange = formData.get("targetAgeRange") as string | null;
  const targetGender = (formData.get("targetGender") as string) || "all";
  const interestsRaw = formData.get("targetInterests") as string | null;
  const locationsRaw = formData.get("targetLocations") as string | null;

  const targetInterests = interestsRaw ? JSON.parse(interestsRaw) as string[] : [];
  const targetLocations = locationsRaw ? JSON.parse(locationsRaw) as string[] : [];

  await upsertBrand({
    user_id: session.id,
    name: name || session.fullName || "Brand",
    category: category || null,
    description: description || null,
    target_age_range: targetAgeRange || null,
    target_gender: targetGender,
    target_interests: targetInterests,
    target_locations: targetLocations,
  });

  revalidatePath("/brand/settings");
  revalidatePath("/brand");

  return { success: true };
}
