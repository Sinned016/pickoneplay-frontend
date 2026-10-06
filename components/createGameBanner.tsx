"use client";

import Button from "@/components/ui/Button";
import VsDivider from "@/components/ui/VsDivider";
import { useAuth } from "@/store/useAuth";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function CreateGameBanner() {
  const user = useAuth((state) => state.user);
  const isUserLoggedIn = !!user;

  return (
    <div className="max-w-7xl mx-auto mt-8 mb-16 sm:mb-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glow-border relative overflow-hidden rounded-2xl bg-surface2 backdrop-blur-xl shadow-md"
      >
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-main1/15 blur-3xl animate-drift" aria-hidden />
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-main2/15 blur-3xl animate-drift [animation-delay:-7s]" aria-hidden />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-6 sm:p-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Mini duel */}
            <div className="flex items-center gap-2 shrink-0" aria-hidden>
              <motion.span
                animate={{ rotate: [-8, 0, -8], y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center justify-center w-14 h-14 rounded-2xl bg-main1/15 border border-main1/40 text-3xl shadow-glow-main1"
              >
                🍕
              </motion.span>
              <VsDivider />
              <motion.span
                animate={{ rotate: [8, 0, 8], y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="flex items-center justify-center w-14 h-14 rounded-2xl bg-main2/15 border border-main2/40 text-3xl shadow-glow-main2"
              >
                🍔
              </motion.span>
            </div>

            <div>
              <h2 className="flex items-center justify-center md:justify-start gap-2 text-2xl md:text-3xl text-white font-black">
                <Sparkles className="w-6 h-6 text-main1" />
                Got a would-you-rather idea?
              </h2>
              <p className="text-text1 mt-2 max-w-md">
                Create your own game in minutes and see which side your friends pick.
              </p>
            </div>
          </div>

          <Button
            href={isUserLoggedIn ? "/create" : "/login"}
            variant="primary"
            size="lg"
            className="shrink-0"
          >
            {isUserLoggedIn ? "Create a game" : "Login to create"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
