"use client";

import { cn } from "@/lib/utils";
import { Gamepad2, Settings } from "lucide-react";
import { motion } from "motion/react";
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
              "relative isolate flex items-center gap-2 py-2 px-5 rounded-lg text-sm transition-colors duration-200",
              active
                ? "text-black font-bold"
                : "font-medium text-muted hover:text-text1-hover hover:bg-surface1-hover",
            )}
          >
            {active && (
              <motion.span
                layoutId="profile-tab"
                className="absolute inset-0 -z-10 rounded-lg bg-main1 shadow-glow-main1"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <Icon className="w-4 h-4" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
