"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";

type Props = {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
};

// Counts from 0 to `value` the first time it scrolls into view.
export default function CountUp({
  value,
  duration = 1.2,
  suffix = "",
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;

    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = `${Math.round(latest).toLocaleString()}${suffix}`;
        }
      },
    });

    return () => controls.stop();
  }, [inView, value, duration, suffix]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
