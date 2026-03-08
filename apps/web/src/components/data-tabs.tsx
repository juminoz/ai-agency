"use client";

import { useState } from "react";

interface DataTabsProps {
  toolsContent: React.ReactNode;
  channelsContent: React.ReactNode;
}

const TABS = [
  { id: "channels", label: "Channels" },
  { id: "tools", label: "Tools" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function DataTabs({ toolsContent, channelsContent }: DataTabsProps) {
  const [active, setActive] = useState<TabId>("channels");

  return (
    <div className="space-y-6">
      <div className="flex gap-1 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              active === tab.id
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            type="button"
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === "channels" && channelsContent}
      {active === "tools" && toolsContent}
    </div>
  );
}
