"use client";

import { useMemo } from "react";

// Preview url for a picked File, derived from the form value itself so it
// survives steps unmounting and pairs being removed/reordered.
export function useObjectUrl(file: File | null | undefined): string | null {
  return useMemo(
    () => (file instanceof File ? URL.createObjectURL(file) : null),
    [file],
  );
}
