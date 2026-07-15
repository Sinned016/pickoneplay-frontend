"use client";

import ImageUploadTile from "@/components/ui/ImageUploadTile";
import Input from "@/components/ui/Input";
import VsDivider from "@/components/ui/VsDivider";
import { CreateGameFormData } from "@/types/CreateGameFormData";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function CreatePairsForm() {
  const { control, register, setValue } = useFormContext<CreateGameFormData>();
  const [previews, setPreviews] = useState<Record<string, string>>({});

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

  const removeLastPair = () => {
    if (fields.length > 3) {
      remove(fields.length - 1);
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

      setPreviews((prev) => ({
        ...prev,
        [`${index}-${side}`]: previewUrl,
      }));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {fields.map((field, i) => (
        <div key={field.id} className="flex flex-col gap-2">
          <span className="text-text1 font-medium">Pair {i + 1}</span>

          <div className="flex items-center gap-4">
            {/* Left side */}
            <div className="flex-1 flex flex-col gap-2">
              <Input
                placeholder="Enter name..."
                {...register(`pairs.${i}.leftName`)}
              />

              <ImageUploadTile
                preview={previews[`${i}-left`] ?? null}
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
                preview={previews[`${i}-right`] ?? null}
                alt="Right image preview"
                className="h-40 w-full"
                accent="main2"
                onChange={(file) => handleImageChange(file, i, "right")}
              />
            </div>
          </div>
        </div>
      ))}

      {/* <div className="flex justify-center items-center gap-6">
        {fields.length > 4 && (
          <button
            type="button"
            onClick={removeLastPair}
            className="px-4 py-2 rounded-lg bg-red-500 text-white"
          >
            -
          </button>
        )}

        {fields.length < 8 && (
          <button
            type="button"
            onClick={addPair}
            className="px-4 py-2 rounded-lg bg-main1 hover:bg-main1-hover transition-all duration-200 text-black font-medium self-start"
          >
            +
          </button>
        )}
      </div> */}
    </div>
  );
}
