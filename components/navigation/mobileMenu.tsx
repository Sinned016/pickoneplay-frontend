"use client";

import { useAuth } from "@/store/useAuth";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const user = useAuth((state) => state.user);
  const isUserLoggedIn = !!user;

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 text-text1 hover:text-text1-hover cursor-pointer"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 w-full bg-surface1/95 backdrop-blur-lg border-t border-border1 animate-in slide-in-from-top animate-duration-300">
          <div className="px-4 py-4 sm:py-6 sm:px-6 flex flex-col gap-3 sm:gap-4">
            <Link
              className="text-text1 hover:text-text1-hover transition-colors"
              href="/games"
              onClick={() => setOpen(false)}
            >
              Games
            </Link>

            <span
              aria-disabled
              title="Coming soon"
              className="text-muted/50 cursor-not-allowed"
            >
              Random
            </span>

            {isUserLoggedIn && (
              <Link
                className="text-text1 hover:text-text1-hover transition-colors"
                href="/create"
                onClick={() => setOpen(false)}
              >
                Create
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
