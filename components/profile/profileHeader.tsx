"use client";

import CountUp from "@/components/ui/CountUp";
import { useAuth } from "@/store/useAuth";
import { User } from "@/types/User";
import { CalendarDays, Shield } from "lucide-react";
import { motion } from "motion/react";

type Props = {
  user: User;
  stats: { games: number; plays: number };
};

export default function ProfileHeader({ user: serverUser, stats }: Props) {
  // Prefer the client store so a username change in Settings shows up immediately.
  const storeUser = useAuth((state) => state.user);
  const user = storeUser ?? serverUser;

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glow-border relative overflow-hidden rounded-2xl bg-surface1 backdrop-blur-xl shadow-md"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-main1/10 via-transparent to-main2/10" aria-hidden />

      <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 sm:p-8 text-center md:text-left">
        <Avatar name={user.username} />

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Your profile
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-black text-white truncate">
            {user.username}
          </h1>
          <div className="mt-2 flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span className="truncate max-w-full">{user.email}</span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              Member since {memberSince}
            </span>
            {user.role === "ADMIN" && (
              <span className="flex items-center gap-1.5 text-main2">
                <Shield size={14} />
                Admin
              </span>
            )}
          </div>
        </div>

        <dl className="flex gap-3 shrink-0">
          {[
            { label: "Games", value: stats.games, color: "text-main1" },
            { label: "Total plays", value: stats.plays, color: "text-main2" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="min-w-28 rounded-xl border border-border1 bg-surface2 px-4 py-3 text-center"
            >
              <dd className={`text-2xl font-black tabular-nums ${stat.color}`}>
                <CountUp value={stat.value} />
              </dd>
              <dt className="text-xs uppercase tracking-widest text-muted">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </motion.div>
  );
}

// Initial letter inside a slowly spinning cyan -> coral ring.
export function Avatar({ name, size = "lg" }: { name: string; size?: "md" | "lg" }) {
  const outer = size === "lg" ? "w-24 h-24" : "w-14 h-14";
  const text = size === "lg" ? "text-4xl" : "text-2xl";

  return (
    <div className={`relative ${outer} shrink-0`}>
      <motion.div
        className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--color-main1),var(--color-main2),var(--color-main1))] shadow-glow-duel"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <div className={`absolute inset-[3px] flex items-center justify-center rounded-full bg-background ${text} font-black`}>
        <span className="bg-gradient-to-br from-main1 to-main2 bg-clip-text text-transparent">
          {name.charAt(0).toUpperCase() || "?"}
        </span>
      </div>
    </div>
  );
}
