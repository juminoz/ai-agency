import { NextResponse } from "next/server";

import { createAuthServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createAuthServerClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to the requested path or infer from role
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      const role = data.user?.user_metadata?.role as string | undefined;
      const dest = role === "brand" ? "/brand" : "/creator";
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
