"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Role = "creator" | "brand" | "admin";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  creator: [
    { label: "Home", href: "/creator", icon: "🏠" },
    { label: "My Profile", href: "/creator/profile", icon: "👤" },
    { label: "Brands", href: "/creator/brands", icon: "🏢" },
    { label: "Deals", href: "/creator/deals", icon: "🤝" },
    { label: "Messages", href: "/creator/messages", icon: "💬" },
    { label: "Settings", href: "/creator/settings", icon: "⚙️" },
  ],
  brand: [
    { label: "Home", href: "/brand", icon: "🏠" },
    { label: "Find Creators", href: "/brand/search", icon: "🔍" },
    { label: "Campaigns", href: "/brand/campaigns", icon: "📢" },
    { label: "Shortlist", href: "/brand/shortlists", icon: "⭐" },
    { label: "Deals", href: "/brand/deals", icon: "🤝" },
    { label: "Messages", href: "/brand/messages", icon: "💬" },
    { label: "Settings", href: "/brand/settings", icon: "⚙️" },
  ],
  admin: [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Creators", href: "/admin/creators", icon: "👤" },
    { label: "Brands", href: "/admin/brands", icon: "🏢" },
    { label: "Moderation", href: "/admin/moderation", icon: "🛡️" },
    { label: "Analytics", href: "/admin/analytics", icon: "📈" },
    { label: "Settings", href: "/admin/settings", icon: "⚙️" },
  ],
};

function isActive(pathname: string, href: string, role: Role): boolean {
  if (href === `/${role}`) {
    return pathname === href;
  }
  return pathname.startsWith(href);
}

interface SidebarNavProps {
  role: Role;
}

export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname();
  const items = NAV_ITEMS[role];

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[250px] flex-col border-r border-surface-200 bg-white md:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary">
          <span className="text-lg font-bold text-white">B</span>
        </div>
        <span className="text-lg font-bold text-gray-800">Brand Buddy</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-1">
          {items.map((item) => {
            const active = isActive(pathname, item.href, role);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-brand-primary text-white shadow-sm"
                      : "text-gray-600 hover:bg-surface-100 hover:text-gray-900"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Help card */}
      <div className="px-4 pb-3">
        <div className="rounded-card bg-surface-100 p-4">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent-100">
            <span className="text-lg">🤖</span>
          </div>
          <p className="text-sm font-medium text-gray-800">Need help?</p>
          <p className="mt-0.5 text-xs text-gray-500">
            Chat with our assistant
          </p>
          <button className="mt-2 w-full rounded-button bg-brand-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-500">
            Get Help
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="border-t border-surface-200 px-4 py-3">
        <div className="flex items-center gap-2 rounded-xl bg-surface-50 px-3 py-2">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none"
          />
        </div>
      </div>
    </aside>
  );
}

/* Mobile sidebar toggle + overlay */
export function MobileSidebarToggle({
  role,
  isOpen,
  onToggle,
}: {
  role: Role;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const items = NAV_ITEMS[role];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Slide-in sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[250px] transform bg-white shadow-xl transition-transform md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary">
              <span className="text-lg font-bold text-white">B</span>
            </div>
            <span className="text-lg font-bold text-gray-800">Brand Buddy</span>
          </div>
          <button onClick={onToggle} className="text-gray-500 hover:text-gray-700">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="px-3 py-2">
          <ul className="space-y-1">
            {items.map((item) => {
              const active = isActive(pathname, item.href, role);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onToggle}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? "bg-brand-primary text-white shadow-sm"
                        : "text-gray-600 hover:bg-surface-100 hover:text-gray-900"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
