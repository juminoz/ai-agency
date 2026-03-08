import { NextResponse } from "next/server";

import { createAuthServerClient } from "@/lib/supabase/server";

/**
 * Checks that the request has a valid authenticated session.
 * Returns the user if authenticated, or a 401 NextResponse if not.
 */
export async function requireAuth() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Unauthorized: authentication required" },
        { status: 401 },
      ),
    };
  }

  return { user, error: null };
}
