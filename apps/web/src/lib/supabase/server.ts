import { createServerClient as createSSRServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  return url;
}

function getServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  return key;
}

function getAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return key;
}

/**
 * Service-role client — bypasses RLS completely.
 * Use for data pipeline operations (ingestion, scoring, etc).
 */
export function createServerClient() {
  return createClient(getSupabaseUrl(), getServiceRoleKey(), {
    auth: { persistSession: false },
  });
}

/**
 * Cookie-based auth client — respects the user's session.
 * Use in Server Components, Route Handlers, and Server Actions for auth checks.
 */
export async function createAuthServerClient() {
  const cookieStore = await cookies();

  return createSSRServerClient(getSupabaseUrl(), getAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // setAll can fail in Server Components (read-only).
          // This is expected — session refresh happens in middleware.
        }
      },
    },
  });
}
