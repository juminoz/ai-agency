import { NextResponse } from "next/server";

import {
  createAuthServerClient,
  createServerClient,
} from "@/lib/supabase/server";

/**
 * Checks that the request has a valid admin session.
 * Returns the user + profile if admin, or an error NextResponse.
 */
export async function requireAdmin() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      profile: null,
      error: NextResponse.json(
        { error: "Unauthorized: authentication required" },
        { status: 401 }
      ),
    };
  }

  const adminClient = createServerClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return {
      user,
      profile: null,
      error: NextResponse.json(
        { error: "Forbidden: admin access required" },
        { status: 403 }
      ),
    };
  }

  return { user, profile, error: null };
}
