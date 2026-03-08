import { createAuthServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as {user?.email}
        </p>
      </div>

      <div className="rounded-lg border border-dashed p-12 text-center">
        <h2 className="text-lg font-medium">Dashboard</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your personalized dashboard is coming soon.
        </p>
      </div>
    </div>
  );
}
