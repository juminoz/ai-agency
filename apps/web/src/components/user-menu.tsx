"use client";

import { Button } from "@repo/ui/components/button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function UserMenu() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
    });
  }, []);

  const handleLogout = useCallback(async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }, [router]);

  if (!email) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">{email}</span>
      <Button size="sm" variant="ghost" onClick={handleLogout}>
        Sign out
      </Button>
    </div>
  );
}
