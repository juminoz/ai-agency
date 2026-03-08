import { redirect } from "next/navigation";

import { createAuthServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = user.user_metadata?.role as string | undefined;

  if (role === "brand") redirect("/brand");
  if (role === "admin") redirect("/admin");

  // Default to creator dashboard
  redirect("/creator");
}
