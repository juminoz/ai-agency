import { redirect } from "next/navigation";

import type { ProfileSubtype } from "@/lib/supabase/types";

import { createAuthServerClient } from "@/lib/supabase/server";

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  subtype: ProfileSubtype;
}

/**
 * Get the current authenticated user + profile info.
 * Returns null if not logged in.
 */
export async function getSession(): Promise<SessionUser | null> {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, subtype")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile?.full_name ?? user.user_metadata?.full_name ?? "",
    subtype: (profile?.subtype as ProfileSubtype) ?? null,
  };
}

/**
 * Require an authenticated session. Redirects to /login if not authenticated.
 */
export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/**
 * Require a specific subtype (creator or brand). Redirects if mismatch.
 */
export async function requireRole(
  role: "creator" | "brand",
): Promise<SessionUser> {
  const session = await requireSession();
  if (session.subtype !== role) {
    redirect(session.subtype === "brand" ? "/brand" : "/creator");
  }
  return session;
}
