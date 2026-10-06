"use client";

import { motion } from "motion/react";
import VsDivider from "@/components/ui/VsDivider";

type Props = {
  loaded: number;
  total: number;
};

// Full-screen hold while the session's images finish loading.
export default function GameLoader({ loaded, total }: Props) {
  const percent = total === 0 ? 100 : Math.round((loaded / total) * 100);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 bg-background px-6">
      <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-main1/15 blur-3xl animate-drift" aria-hidden />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-main2/15 blur-3xl animate-drift [animation-delay:-7s]" aria-hidden />

      <VsDivider size="lg" />

      <div className="relative w-full max-w-sm text-center">
        <p className="text-lg font-semibold text-text1">Getting the rounds ready…</p>
        <p className="mt-1 text-sm text-muted">
          {loaded} / {total} images
        </p>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface2">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-main1 to-main2"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
