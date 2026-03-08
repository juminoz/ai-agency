"use client";

import { usePathname } from "next/navigation";

import { DashboardShell } from "@/components/dashboard-shell";

const PAGE_TITLES: Record<string, string> = {
  "/brand": "Dashboard",
  "/brand/search": "Find Creators",
  "/brand/campaigns": "Campaigns",
  "/brand/shortlists": "Shortlists",
  "/brand/deals": "Deals",
  "/brand/messages": "Messages",
  "/brand/settings": "Settings",
};

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageTitle = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <DashboardShell role="brand" pageTitle={pageTitle}>
      {children}
    </DashboardShell>
  );
}
