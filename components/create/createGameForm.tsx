"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ImageUploadTile from "@/components/ui/ImageUploadTile";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { CreateGameFormData } from "@/types/CreateGameFormData";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export default function CreateGameForm() {
  const { register, watch, setValue } = useFormContext<CreateGameFormData>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    <div className="flex flex-col gap-2 rounded-xl text-text1">
      <div className="flex flex-col gap-6 mt-2">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-lg" htmlFor="">
            Game Title *
          </label>
          <Input
            type="text"
            placeholder="Game title..."
            {...register("title", { required: true })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-lg" htmlFor="">
            Description *
          </label>
          <Textarea
            rows={3}
            placeholder="Description..."
            {...register("description", { required: true })}
          />
        </div>

        <div className="mx-auto mt-4">
          <ImageUploadTile
            preview={imagePreview}
            alt="Game preview"
            className="w-40 h-40"
            onChange={(file) => {
              setValue("image", file, { shouldDirty: true });
              setImagePreview(file ? URL.createObjectURL(file) : null);
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-lg" htmlFor="">
            Category
          </label>
          <Input
            type="text"
            placeholder="Category..."
            {...register("category")}
          />
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <span className="font-medium text-lg">Tags *</span>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Tags..."
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
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, i) => (
              <Badge
                key={i}
                onRemove={() =>
                  setValue(
                    "tags",
                    tags.filter((_, index) => index !== i),
                  )
                }
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
