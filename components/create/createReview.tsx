"use client";

import VsDivider from "@/components/ui/VsDivider";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { CreateGameFormData } from "@/types/CreateGameFormData";
import { ImageIcon, Pencil, Play } from "lucide-react";
import { motion } from "motion/react";
import { useFormContext } from "react-hook-form";

type Props = {
  onEditStep: (step: number) => void;
};

function Thumb({ file, alt, tint }: { file?: File | null; alt: string; tint: string }) {
  const url = useObjectUrl(file);

  return (
    <div className={`relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 overflow-hidden rounded-xl border ${tint} bg-surface2 flex items-center justify-center`}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <ImageIcon size={18} className="text-muted" />
      )}
    </div>
  );
}

function EditLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-sm font-medium text-main1 hover:text-main1-hover cursor-pointer"
    >
      <Pencil size={14} />
      Edit
    </button>
  );
}

export default function CreateReview({ onEditStep }: Props) {
  const { watch } = useFormContext<CreateGameFormData>();
  const values = watch();
  const cover = useObjectUrl(values.image);

  const filledPairs = values.pairs.filter(
    (p) => p.leftName.trim() && p.rightName.trim(),
  );
  const skipped = values.pairs.length - filledPairs.length;

  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-8 text-text1">
      {/* Card preview, as it will look in the games grid */}
      <div className="flex flex-col gap-3 items-center md:items-stretch">
        <span className="text-sm font-medium text-muted self-start">
          Card preview
        </span>
        <motion.div
          initial={{ opacity: 0, rotate: -4, scale: 0.92 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="relative w-52 md:w-full aspect-4/5 overflow-hidden rounded-xl border border-border1-strong bg-surface2 shadow-glow-main1"
        >
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-main1/20 to-main2/20">
              <VsDivider size="lg" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {values.category && (
            <span className="absolute top-2 left-2 rounded-full bg-black/50 backdrop-blur-md border border-border1-strong py-0.5 px-2.5 text-[11px] font-semibold uppercase tracking-wide text-text1-hover">
              {values.category}
            </span>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="line-clamp-2 text-sm font-semibold text-white leading-snug">
              {values.title || "Untitled game"}
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted">
              <Play size={11} /> 0 plays
            </p>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col gap-6 min-w-0">
        <section className="rounded-2xl border border-border1 bg-surface2 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white">Details</h3>
            <EditLink onClick={() => onEditStep(1)} />
          </div>
          <p className="text-2xl font-black text-white break-words">{values.title}</p>
          <p className="mt-1 text-muted break-words">{values.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {values.tags.map((tag, i) => (
              <span
                key={tag}
                className={
                  i % 2 === 0
                    ? "rounded-full bg-main1/15 text-main1 py-0.5 px-2.5 text-xs font-semibold"
                    : "rounded-full bg-main2/15 text-main2 py-0.5 px-2.5 text-xs font-semibold"
                }
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border1 bg-surface2 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white">
              Rounds{" "}
              <span className="text-muted font-medium">({filledPairs.length})</span>
            </h3>
            <EditLink onClick={() => onEditStep(2)} />
          </div>

          <ol className="flex flex-col gap-2">
            {filledPairs.map((pair, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-center gap-2 sm:gap-3 rounded-xl bg-surface1 p-2"
              >
                <span className="w-5 text-center text-xs font-bold text-muted shrink-0">
                  {i + 1}
                </span>
                <Thumb file={pair.leftImage} alt={pair.leftName} tint="border-main1/40" />
                <span className="flex-1 min-w-0 truncate text-sm font-semibold text-main1">
                  {pair.leftName}
                </span>
                <span className="text-xs font-black text-muted shrink-0">VS</span>
                <span className="flex-1 min-w-0 truncate text-right text-sm font-semibold text-main2">
                  {pair.rightName}
                </span>
                <Thumb file={pair.rightImage} alt={pair.rightName} tint="border-main2/40" />
              </motion.li>
            ))}
          </ol>

          {skipped > 0 && (
            <p className="mt-3 text-xs text-muted">
              {skipped} empty {skipped === 1 ? "round" : "rounds"} will be skipped.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
