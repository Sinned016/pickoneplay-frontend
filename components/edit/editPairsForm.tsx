"use client";

import Button from "@/components/ui/Button";
import ImageUploadTile from "@/components/ui/ImageUploadTile";
import Input from "@/components/ui/Input";
import VsDivider from "@/components/ui/VsDivider";
import { EditGameFormData } from "@/types/EditGameFormData";
import { Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function EditPairsForm() {
  const { control, register, watch, setValue } =
    useFormContext<EditGameFormData>();
  const [objectUrls, setObjectUrls] = useState<Record<string, string>>({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: "pairs",
  });

  const addPair = () => {
    if (fields.length < 8) {
      append({
        leftName: "",
        leftImage: null,
        rightName: "",
        rightImage: null,
      });
    }
  };

  const removePair = (index: number) => {
    if (fields.length > 3) {
      remove(index);
    }
  };

  const handleImageChange = (
    file: File | null,
    index: number,
    side: "left" | "right",
  ) => {
    setValue(`pairs.${index}.${side}Image`, file, {
      shouldDirty: true,
    });

    if (file) {
      const previewUrl = URL.createObjectURL(file);

      setObjectUrls((prev) => ({
        ...prev,
        [`${index}-${side}`]: previewUrl,
      }));
    }
  };

  const getPreview = (index: number, side: "left" | "right") => {
    const value = watch(`pairs.${index}.${side}Image`);

    if (value instanceof File) {
      return objectUrls[`${index}-${side}`] ?? null;
    }

    return typeof value === "string" ? value : null;
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted">Between 3 and 8 rounds. Each round needs two names.</p>
        <span className="shrink-0 rounded-full border border-border1-strong py-0.5 px-2.5 font-semibold text-text1 tabular-nums">
          {fields.length} / 8
        </span>
      </div>

      <AnimatePresence initial={false}>
        {fields.map((field, i) => (
          <motion.div
            key={field.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-2xl border border-border1 bg-surface2 p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-muted">Round {i + 1}</span>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={fields.length <= 3}
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

                <ImageUploadTile
                  preview={getPreview(i, "left")}
                  alt="Left image preview"
                  className="h-40 w-full"
                  accent="main1"
                  onChange={(file) => handleImageChange(file, i, "left")}
                />
              </div>

              <VsDivider className="self-center" />

              {/* Right side */}
              <div className="flex-1 flex flex-col gap-2 min-w-0">
                <Input
                  placeholder="Option B..."
                  {...register(`pairs.${i}.rightName`)}
                />

                <ImageUploadTile
                  preview={getPreview(i, "right")}
                  alt="Right image preview"
                  className="h-40 w-full"
                  accent="main2"
                  onChange={(file) => handleImageChange(file, i, "right")}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {fields.length < 8 && (
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
