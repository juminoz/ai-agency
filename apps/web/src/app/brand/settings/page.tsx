import { BrandSettingsForm } from "./settings-form";

import { requireRole } from "@/lib/auth/session";
import { getBrandByUserId } from "@/lib/data";


export default async function BrandSettingsPage() {
  const session = await requireRole("brand");
  const brand = await getBrandByUserId(session.id);

  return (
    <BrandSettingsForm
      brand={brand}
      sessionEmail={session.email}
      sessionName={session.fullName}
    />
  );
}
