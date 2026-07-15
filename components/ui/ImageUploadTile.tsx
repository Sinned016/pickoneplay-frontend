"use client";

import { cn } from "@/lib/utils";
import { ImagePlus } from "lucide-react";

type Props = {
  preview: string | null;
  onChange: (file: File | null) => void;
  alt?: string;
  className?: string;
  accent?: "main1" | "main2";
};

const accentClasses: Record<"main1" | "main2", string> = {
  main1: "hover:border-main1/60 hover:shadow-glow-main1",
  main2: "hover:border-main2/60 hover:shadow-glow-main2",
};

export default function ImageUploadTile({
  preview,
  onChange,
  alt = "Preview",
  className,
  accent = "main1",
}: Props) {
  return (
    <label
      className={cn(
        "flex items-center justify-center rounded-xl border border-border1 bg-surface1 backdrop-blur-sm cursor-pointer overflow-hidden transition-all duration-200",
        accentClasses[accent],
        className,
      )}
    >
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted">
          <ImagePlus size={28} />
          <span className="text-xs">Upload image</span>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </label>
  );
}
