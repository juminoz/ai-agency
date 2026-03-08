"use client";

import { usePathname } from "next/navigation";

import { DashboardShell } from "@/components/dashboard-shell";

const PAGE_TITLES: Record<string, string> = {
  "/creator": "Dashboard",
  "/creator/profile": "My Profile",
  "/creator/brands": "Brand Discovery",
  "/creator/deals": "Deals",
  "/creator/messages": "Messages",
  "/creator/settings": "Settings",
};

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageTitle = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <DashboardShell role="creator" pageTitle={pageTitle}>
      {children}
    </DashboardShell>
  );
}
