"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ImageUploadTile from "@/components/ui/ImageUploadTile";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { CreateGameFormData } from "@/types/CreateGameFormData";
import { Folder, Hash, Lightbulb, Plus, Type } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export default function CreateGameForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateGameFormData>();

  // Derived from the form value so it survives going back from step 2.
  const imagePreview = useObjectUrl(watch("image"));

  const tags = watch("tags") || [];
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const value = tagInput.trim();

    if (!value) return;
    if (tags.includes(value)) return;

    setValue("tags", [...tags, value], {
      shouldDirty: true,
      shouldValidate: true,
    });

    setTagInput("");
  };

  return (
    <div className="flex flex-col gap-8 text-text1">
      <div className="flex items-start gap-3 rounded-xl border border-main1/20 bg-main1/5 p-4 text-sm">
        <Lightbulb size={18} className="text-main1 shrink-0 mt-0.5" />
        <p className="text-text1">
          Give your game a catchy title and a cover that makes people want to
          click. You&apos;ll add the actual dilemmas in the next step.
        </p>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        <div className="flex flex-col gap-2 items-center md:items-stretch">
          <span className="font-medium self-start">Cover image</span>
          <ImageUploadTile
            preview={imagePreview}
            alt="Game preview"
            className="w-48 md:w-full aspect-4/5"
            onChange={(file) => {
              setValue("image", file, { shouldDirty: true });
            }}
          />
          <p className="text-xs text-muted self-start">
            Shown on game cards and the game page.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium" htmlFor="create-title">
              Game title <span className="text-main2">*</span>
            </label>
            <Input
              id="create-title"
              icon={Type}
              type="text"
              placeholder="e.g. Ultimate Snack Showdown"
              error={!!errors.title}
              {...register("title", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium" htmlFor="create-description">
              Description <span className="text-main2">*</span>
            </label>
            <Textarea
              id="create-description"
              rows={3}
              placeholder="What's this game about?"
              error={!!errors.description}
              {...register("description", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium" htmlFor="create-category">
              Category
            </label>
            <Input
              id="create-category"
              icon={Folder}
              type="text"
              placeholder="e.g. Food, Movies, Travel"
              {...register("category")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium" htmlFor="create-tags">
              Tags <span className="text-main2">*</span>
            </label>
            <div className="flex gap-2">
              <Input
                id="create-tags"
                icon={Hash}
                type="text"
                placeholder="Type a tag and press Enter"
                wrapperClassName="flex-1"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={addTag}>
                <Plus size={16} />
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 min-h-8">
              <AnimatePresence initial={false}>
                {tags.map((tag, i) => (
                  <motion.div
                    key={tag}
                    layout
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Badge
                      tone={i % 2 === 0 ? "main1" : "main2"}
                      onRemove={() =>
                        setValue(
                          "tags",
                          tags.filter((_, index) => index !== i),
                        )
                      }
                    >
                      #{tag}
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
              {tags.length === 0 && (
                <span className="text-xs text-muted self-center">
                  No tags yet — add at least one.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
