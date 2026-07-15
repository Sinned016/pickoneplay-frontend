"use client";
import Button from "@/components/ui/Button";
import { useAuth } from "@/store/useAuth";

export default function Hero() {
  const user = useAuth((state) => state.user);
  const isUserLoggedIn = !!user;

  return (
    <header className="relative overflow-hidden py-24 md:py-32 text-center hero-bg">
      <div
        className="hidden md:block absolute -z-10 top-1/2 left-[8%] -translate-y-1/2 w-72 h-72 rounded-full bg-main1/20 blur-3xl"
        aria-hidden
      />
      <div
        className="hidden md:block absolute -z-10 top-1/2 right-[8%] -translate-y-1/2 w-72 h-72 rounded-full bg-main2/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-2xl px-4">
        <span className="inline-flex items-center py-1.5 px-4 mb-5 rounded-full border border-border1 backdrop-blur-sm text-sm font-medium text-main1">
          PickOnePlay
        </span>

        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.05]">
          The Ultimate
          <span className="block bg-gradient-to-r from-main1 via-white to-main2 bg-clip-text text-transparent">
            Would You Rather
          </span>
          Experience
        </h1>

        <p className="mt-6 text-lg text-text1">
          Create games, challenge friends, and see which side wins.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/games" variant="primary" size="lg">
            Browse games
          </Button>

          {isUserLoggedIn ? (
            <Button href="/create" variant="accent" size="lg">
              Create Game
            </Button>
          ) : (
            <Button href="/login" variant="accent" size="lg">
              Login to create
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
