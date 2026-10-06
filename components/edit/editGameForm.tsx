"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ImageUploadTile from "@/components/ui/ImageUploadTile";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { EditGameFormData } from "@/types/EditGameFormData";
import { Folder, Hash, Plus, Type } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export default function EditGameForm() {
  const { register, watch, setValue } = useFormContext<EditGameFormData>();

  const initialImage = watch("image");
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof initialImage === "string" ? initialImage : null,
  );

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
    <div className="grid md:grid-cols-[220px_1fr] gap-8 text-text1">
      <div className="flex flex-col gap-2 items-center md:items-stretch">
        <span className="font-medium self-start">Cover image</span>
        <ImageUploadTile
          preview={imagePreview}
          alt="Game preview"
          className="w-48 md:w-full aspect-4/5"
          onChange={(file) => {
            setValue("image", file, { shouldDirty: true });
            setImagePreview(file ? URL.createObjectURL(file) : null);
          }}
        />
        <p className="text-xs text-muted self-start">
          Shown on game cards and the game page.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-medium" htmlFor="edit-title">
            Game title <span className="text-main2">*</span>
          </label>
          <Input
            id="edit-title"
            icon={Type}
            type="text"
            placeholder="Game title..."
            {...register("title", { required: true })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium" htmlFor="edit-description">
            Description <span className="text-main2">*</span>
          </label>
          <Textarea
            id="edit-description"
            rows={3}
            placeholder="Description..."
            {...register("description", { required: true })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium" htmlFor="edit-category">
            Category
          </label>
          <Input
            id="edit-category"
            icon={Folder}
            type="text"
            placeholder="Category..."
            {...register("category")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium" htmlFor="edit-tags">
            Tags <span className="text-main2">*</span>
          </label>
          <div className="flex gap-2">
            <Input
              id="edit-tags"
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
          </div>
        </div>
      </div>
    </div>
  );
}
