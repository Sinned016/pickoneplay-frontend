"use client";

import { MotionConfig } from "motion/react";
import { ReactNode } from "react";

// Respects the OS "reduce motion" setting for every motion component in the app.
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
