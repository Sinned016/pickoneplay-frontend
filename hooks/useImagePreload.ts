"use client";

import { preloadImage } from "@/lib/preloadImages";
import { useEffect, useMemo, useState } from "react";

// Preloads every url and reports progress, e.g. for a "Loading rounds 7/20" bar.
export function useImagePreload(urls: string[]) {
  const uniqueUrls = useMemo(() => Array.from(new Set(urls)), [urls]);
  const key = uniqueUrls.join("|");

  const [progress, setProgress] = useState({ key, loaded: 0 });

  useEffect(() => {
    let cancelled = false;

    uniqueUrls.forEach((url) => {
      preloadImage(url).then(() => {
        if (cancelled) return;
        setProgress((prev) =>
          prev.key === key
            ? { key, loaded: prev.loaded + 1 }
            : { key, loaded: 1 },
        );
      });
    });

    return () => {
      cancelled = true;
    };
    // `key` captures the url list; uniqueUrls is derived from it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const loaded = progress.key === key ? progress.loaded : 0;
  const total = uniqueUrls.length;

  return { loaded, total, done: loaded >= total };
}
