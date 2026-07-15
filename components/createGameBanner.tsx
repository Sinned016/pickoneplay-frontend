"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useAuth } from "@/store/useAuth";
import { Sparkles } from "lucide-react";

export default function CreateGameBanner() {
  const user = useAuth((state) => state.user);
  const isUserLoggedIn = !!user;

  return (
    <div className="max-w-7xl mx-auto mt-8 mb-16 sm:mb-24 px-4 sm:px-6 lg:px-8">
      <Card
        variant="surface2"
        radius="2xl"
        padding="lg"
        className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
      >
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex rounded-full p-3 bg-gradient-to-br from-main1/15 to-main2/15 border border-border1">
            <Sparkles className="w-6 h-6 text-main1" />
          </div>

          <div>
            <h2 className="text-xl text-text1 font-semibold">
              Got a would-you-rather idea?
            </h2>
            <p className="text-muted mt-1">
              Create your own game and see which side your friends pick.
            </p>
          </div>
        </div>

        {isUserLoggedIn ? (
          <Button
            href="/create"
            variant="primary"
            size="lg"
            className="shrink-0"
          >
            Create a game
          </Button>
        ) : (
          <Button
            href="/login"
            variant="primary"
            size="lg"
            className="shrink-0"
          >
            Login to create
          </Button>
        )}
      </Card>
    </div>
  );
}
