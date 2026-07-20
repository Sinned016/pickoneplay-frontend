"use client";

import Button from "@/components/ui/Button";
import ImageUploadTile from "@/components/ui/ImageUploadTile";
import Input from "@/components/ui/Input";
import { EditGameFormData } from "@/types/EditGameFormData";
import { Plus, Trash2 } from "lucide-react";
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
    <div className="flex flex-col gap-6">
      {fields.map((field, i) => (
        <div key={field.id} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-text1 font-medium">Pair {i + 1}</span>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={fields.length <= 3}
              onClick={() => removePair(i)}
              aria-label={`Remove pair ${i + 1}`}
            >
              <Trash2 size={18} />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            {/* Left side */}
            <div className="flex-1 flex flex-col gap-2">
              <Input
                placeholder="Enter name..."
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

            <span className="px-8 text-sm md:text-base font-black tracking-wide text-text1 shrink-0">
              VS
            </span>

            {/* Right side */}
            <div className="flex-1 flex flex-col gap-2">
              <Input
                placeholder="Enter name..."
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
        </div>
      ))}

      {fields.length < 8 && (
        <Button
          type="button"
          variant="secondary"
          onClick={addPair}
          className="self-start"
        >
          <Plus size={16} />
          Add pair
        </Button>
      )}
    </div>
  );
}
