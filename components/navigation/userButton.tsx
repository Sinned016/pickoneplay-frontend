"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useAuth } from "@/store/useAuth";
import { LogIn, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function UserButton() {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const user = useAuth((state) => state.user);
  const isUserLoggedIn = !!user;
  const router = useRouter();

  const logout = useAuth((state) => state.logout);

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div>
      {isUserLoggedIn ? (
        <div ref={containerRef} className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-1 rounded-full bg-white cursor-pointer transition-all duration-200"
          >
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-3" />
          </button>

          <div
            className={`absolute right-0 top-full mt-6 z-50 w-48 origin-top-right transition-all duration-150 ${
              menuOpen
                ? "opacity-100 scale-100"
                : "pointer-events-none scale-95 opacity-0"
            }`}
          >
            <Card
              variant="surface2"
              padding="none"
              radius="xl"
              className="shadow-lg! flex flex-col items-center overflow-hidden"
            >
              <div className="p-1 rounded-full border-2 bg-white border-black mt-6">
                <User className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-black stroke-3" />
              </div>

              <div className="text-text1 text-sm lg:text-base mb-1 mt-2 max-w-full truncate px-3 font-medium">
                {user?.username}
              </div>

              <div className="flex w-full flex-col items-stretch gap-0.5 px-2 pb-2 mt-1">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/profile/settings");
                  }}
                  className="flex items-center gap-2 rounded-lg py-2 px-3 text-sm text-text1 cursor-pointer hover:bg-surface2-hover transition-all duration-200"
                >
                  <Settings className="w-4 h-4" />
                  Profile
                </button>

                <div className="h-px w-full bg-border1 my-1" />

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2 rounded-lg py-2 px-3 text-sm text-error cursor-pointer hover:bg-surface2-hover transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Button href="/login" size="sm" className="text-xs lg:text-lg">
          <LogIn className="w-5 h-5" />
          Login
        </Button>
      )}
    </div>
  );
}
