"use client";

import { usePathname } from "next/navigation";

import { DashboardShell } from "@/components/dashboard-shell";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/creators": "Creators",
  "/admin/brands": "Brands",
  "/admin/moderation": "Moderation",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Settings",
  "/admin/data": "Data Pipeline",
  "/admin/data/import": "Import Channels",
  "/admin/data/search": "Search Channels",
  "/admin/data/simulate": "Campaign Simulator",
  "/admin/data/analytics": "Pipeline Analytics",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageTitle = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <DashboardShell pageTitle={pageTitle} role="admin">
      {children}
    </DashboardShell>
  );
}
