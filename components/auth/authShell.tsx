"use client";

import VsDivider from "@/components/ui/VsDivider";
import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accent: "main1" | "main2";
  children: ReactNode;
};

// Shared two-column layout for login/register: animated brand panel + form card.
export default function AuthShell({
  title,
  subtitle,
  icon: Icon,
  accent,
  children,
}: Props) {
  return (
    <div className="relative isolate min-h-[calc(100dvh-4rem)] flex items-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="absolute top-1/4 left-[10%] -z-10 w-72 h-72 rounded-full bg-main1/15 blur-3xl animate-drift" aria-hidden />
      <div className="absolute bottom-1/4 right-[10%] -z-10 w-72 h-72 rounded-full bg-main2/15 blur-3xl animate-drift [animation-delay:-7s]" aria-hidden />

      <div className="mx-auto w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Brand panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden lg:flex flex-col gap-8"
        >
          <h1 className="text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.02]">
            Pick{" "}
            <span className="bg-gradient-to-r from-main1 to-main2 bg-clip-text text-transparent animate-gradient-pan">
              one.
            </span>
            <span className="block text-4xl xl:text-5xl text-text1 mt-2">
              See who agrees.
            </span>
          </h1>

          <div className="relative h-56 max-w-md" aria-hidden>
            <motion.div
              className="absolute left-0 top-6 w-40 h-40 rounded-full bg-gradient-to-br from-main1 to-cyan-700 shadow-glow-main1-lg flex items-center justify-center text-5xl font-black text-black/70"
              animate={{ y: [0, -14, 0], rotate: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              A
            </motion.div>
            <motion.div
              className="absolute right-0 top-10 w-40 h-40 rounded-full bg-gradient-to-br from-main2 to-rose-700 shadow-glow-main2-lg flex items-center justify-center text-5xl font-black text-black/70"
              animate={{ y: [0, 14, 0], rotate: [0, 6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              B
            </motion.div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <VsDivider size="lg" />
            </div>
          </div>

          <p className="text-text1 text-lg max-w-md">
            Tough choices, one click at a time. Play would-you-rather games,
            create your own and find out which side the crowd is on.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glow-border w-full max-w-md mx-auto lg:mr-0 rounded-2xl bg-surface1 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
        >
          <div className="flex flex-col gap-6 p-6 sm:p-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <div
                className={
                  accent === "main1"
                    ? "rounded-2xl p-3 bg-main1/15 border border-main1/40 shadow-glow-main1"
                    : "rounded-2xl p-3 bg-main2/15 border border-main2/40 shadow-glow-main2"
                }
              >
                <Icon className={accent === "main1" ? "w-6 h-6 text-main1" : "w-6 h-6 text-main2"} />
              </div>
              <h2 className="text-3xl font-black text-white">{title}</h2>
              <p className="text-sm text-muted">{subtitle}</p>
            </div>

            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Staggered fade-up for form fields; wrap each field (and its error) in one.
export function AuthField({ index, children }: { index: number; children: ReactNode }) {
  return (
    <motion.div
      className="flex flex-col gap-2"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 + index * 0.07 }}
    >
      {children}
    </motion.div>
  );
}

// Shakes in whenever the message changes.
export function ShakeError({ message, children }: { message?: string; children: ReactNode }) {
  if (!message) return null;

  return (
    <motion.div
      key={message}
      initial={{ x: 0 }}
      animate={{ x: [0, -8, 8, -6, 6, 0] }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
