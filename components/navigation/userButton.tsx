"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useAuth } from "@/store/useAuth";
import { LogIn, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserButton() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuth((state) => state.user);
  const isUserLoggedIn = !!user;
  const router = useRouter();

  const logout = useAuth((state) => state.logout);

  return (
    <div>
      {isUserLoggedIn ? (
        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-1 rounded-full bg-white cursor-pointer transition-all duration-200"
          >
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-3" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2">
              <Card
                variant="surface2"
                padding="none"
                radius="xl"
                className="shadow-lg! flex flex-col items-center overflow-hidden"
              >
                <div className="p-1 rounded-full border-2 bg-white border-black mt-6">
                  <User className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-black stroke-3" />
                </div>

                <div className="text-text1 text-sm lg:text-base mb-1 mt-2">
                  {user?.username}
                </div>

                <div className="flex flex-col items-center w-full">
                  <span
                    onClick={() => router.push("/profile/settings")}
                    className="text-text1 text-sm lg:text-sm cursor-pointer py-2 px-2 hover:bg-surface2-hover w-42 text-center transition-all duration-200"
                  >
                    Settings
                  </span>
                  <button
                    onClick={logout}
                    className="text-text1 text-sm lg:text-sm cursor-pointer py-2 px-2 hover:bg-surface2-hover w-42 text-center rounded-b-xl transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              </Card>
            </div>
          )}
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
