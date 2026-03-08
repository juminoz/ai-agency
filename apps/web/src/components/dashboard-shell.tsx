"use client";

import { useState } from "react";

import { SidebarNav, MobileSidebarToggle } from "@/components/sidebar-nav";
import { TopHeader } from "@/components/top-header";

interface DashboardShellProps {
  role: "creator" | "brand" | "admin";
  pageTitle: string;
  children: React.ReactNode;
}

export function DashboardShell({ role, pageTitle, children }: DashboardShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Desktop sidebar */}
      <SidebarNav role={role} />

      {/* Mobile sidebar */}
      <MobileSidebarToggle
        role={role}
        isOpen={mobileSidebarOpen}
        onToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main content area */}
      <div className="md:pl-[250px]">
        <TopHeader
          pageTitle={pageTitle}
          onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
