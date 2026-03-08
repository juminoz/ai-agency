import { CreatorSettingsForm } from "./settings-form";

import { requireRole } from "@/lib/auth/session";
import { getCreatorByUserId } from "@/lib/data";


export default async function CreatorSettingsPage() {
  const session = await requireRole("creator");
  const creator = await getCreatorByUserId(session.id);

  return (
    <CreatorSettingsForm
      creator={creator}
      sessionEmail={session.email}
      sessionName={session.fullName}
    />
  );
}
