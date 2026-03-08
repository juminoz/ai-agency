import Link from "next/link";

import { UserMenu } from "@/components/user-menu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4">
          <Link className="text-lg font-bold" href="/admin">
            Vettd <span className="text-xs font-normal text-muted-foreground">Admin</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/admin"
            >
              Channels
            </Link>
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/admin/import"
            >
              Import
            </Link>
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/admin/search"
            >
              Search
            </Link>
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/admin/simulate"
            >
              Simulator
            </Link>
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/admin/analytics"
            >
              Analytics
            </Link>
          </nav>
          <div className="ml-auto">
            <UserMenu />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
