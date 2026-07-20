"use client";

import { cn } from "@/lib/utils";
import { Gamepad2, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/profile/settings", label: "Settings", icon: Settings },
  { href: "/profile/games", label: "My Games", icon: Gamepad2 },
];

export default function ProfileNav() {
  const pathname = usePathname();

  return (
    <nav className="inline-flex self-center items-center gap-1 rounded-xl border border-border1 bg-surface1 backdrop-blur-xl p-1">
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 py-2 px-4 rounded-lg text-sm transition-all duration-200",
              active
                ? "bg-main1 text-black font-bold shadow-glow-main1"
                : "font-medium text-muted hover:text-text1-hover hover:bg-surface1-hover",
            )}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
