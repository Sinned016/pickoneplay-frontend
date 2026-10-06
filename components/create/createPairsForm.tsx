"use client";

import Button from "@/components/ui/Button";
import ImageUploadTile from "@/components/ui/ImageUploadTile";
import Input from "@/components/ui/Input";
import VsDivider from "@/components/ui/VsDivider";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { cn } from "@/lib/utils";
import { CreateGameFormData } from "@/types/CreateGameFormData";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useFieldArray, useFormContext } from "react-hook-form";

const MIN_PAIRS = 3;
const MAX_PAIRS = 8;

// Upload tile whose preview comes straight from the pair's form value, so it
// stays correct when pairs are removed or the user navigates between steps.
function PairImageTile({ index, side }: { index: number; side: "left" | "right" }) {
  const { watch, setValue } = useFormContext<CreateGameFormData>();
  const preview = useObjectUrl(watch(`pairs.${index}.${side}Image`));

  return (
    <ImageUploadTile
      preview={preview}
      alt={`${side === "left" ? "Left" : "Right"} image preview`}
      className="h-40 w-full"
      accent={side === "left" ? "main1" : "main2"}
      onChange={(file) =>
        setValue(`pairs.${index}.${side}Image`, file, { shouldDirty: true })
      }
    />
  );
}

export default function CreatePairsForm() {
  const { control, register, watch } = useFormContext<CreateGameFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "pairs",
  });

  const pairs = watch("pairs");
  const readyCount = pairs.filter(
    (p) => p.leftName.trim() && p.rightName.trim(),
  ).length;

  const addPair = () => {
    if (fields.length < MAX_PAIRS) {
      append({
        leftName: "",
        leftImage: null,
        rightName: "",
        rightImage: null,
      });
    }
  };

  const removePair = (index: number) => {
    if (fields.length > MIN_PAIRS) {
      remove(index);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Each round is one &ldquo;would you rather&rdquo;. Fill in both
          names — images are optional but make it way more fun.
        </p>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn(
              "rounded-full border py-0.5 px-2.5 text-sm font-semibold tabular-nums transition-colors",
              readyCount >= MIN_PAIRS
                ? "border-success/40 text-success"
                : "border-border1-strong text-text1",
            )}
          >
            {readyCount} ready
          </span>
          <span className="rounded-full border border-border1-strong py-0.5 px-2.5 text-sm font-semibold text-text1 tabular-nums">
            {fields.length} / {MAX_PAIRS}
          </span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {fields.map((field, i) => {
          const isReady =
            pairs[i]?.leftName.trim() && pairs[i]?.rightName.trim();

          return (
            <motion.div
              key={field.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "rounded-2xl border bg-surface2 p-4 sm:p-5 transition-colors duration-300",
                isReady ? "border-success/30" : "border-border1",
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-sm font-bold text-muted">
                  Round {i + 1}
                  <AnimatePresence>
                    {isReady && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      >
                        <CheckCircle2 size={16} className="text-success" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={fields.length <= MIN_PAIRS}
                  onClick={() => removePair(i)}
                  aria-label={`Remove pair ${i + 1}`}
                  className="text-muted hover:text-error hover:bg-error/10"
                >
                  <Trash2 size={18} />
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                {/* Left side */}
                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <Input
                    placeholder="Option A..."
                    {...register(`pairs.${i}.leftName`)}
                  />
                  <PairImageTile index={i} side="left" />
                </div>

                <VsDivider className="self-center" />

                {/* Right side */}
                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <Input
                    placeholder="Option B..."
                    {...register(`pairs.${i}.rightName`)}
                  />
                  <PairImageTile index={i} side="right" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {fields.length < MAX_PAIRS && (
        <motion.button
          layout
          type="button"
          onClick={addPair}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border1-strong py-5 text-muted hover:text-white hover:border-main1/60 hover:bg-main1/5 transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Add round
        </motion.button>
      )}
    </div>
  );
}
