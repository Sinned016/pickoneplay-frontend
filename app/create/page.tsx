"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import CreateGameForm from "@/components/create/createGameForm";
import CreatePairsForm from "@/components/create/createPairsForm";
import { useForm, FormProvider } from "react-hook-form";
import { CreateGameFormData } from "@/types/CreateGameFormData";
import { createGame } from "@/services/games";
import { useRouter } from "next/navigation";

export default function Create() {
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState<string | null>(null);
  const router = useRouter();

  const methods = useForm<CreateGameFormData>({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: [],
      image: null,
      pairs: [
        { leftName: "", leftImage: null, rightName: "", rightImage: null },
        { leftName: "", leftImage: null, rightName: "", rightImage: null },
        { leftName: "", leftImage: null, rightName: "", rightImage: null },
      ],
    },
  });

  const {
    trigger,
    getValues,
    setError,
    clearErrors,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  console.log("SAVED VALUES: ", methods.getValues());

  const handleNext = async () => {
    setStepError(null);

    const valid = await trigger([
      "title",
      "description",
      "category",
      "tags",
      "pairs",
    ]);

    const values = getValues();

    const hasRequiredFields =
      values.title.trim() &&
      values.description.trim() &&
      values.tags.length > 0;

    if (!hasRequiredFields || !valid) {
      setStepError("Please fill in the required fields.");
      return;
    }

    if (valid) {
      setStep(2);
    }
  };

  const onSubmit = async (data: CreateGameFormData) => {
    console.log("FINAL SUBMIT:", data);
    setStepError(null);

    const filledPairs = data.pairs.filter(
      (p) => p.leftName.trim() && p.rightName.trim(),
    );

    if (filledPairs.length < 3) {
      setStepError("You must fill at least 3 pairs.");
      return;
    }

    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("tags", JSON.stringify(data.tags));
    formData.append(
      "pairs",
      JSON.stringify(
        filledPairs.map((pair) => ({
          leftName: pair.leftName,
          rightName: pair.rightName,
        })),
      ),
    );

    if (data.image) {
      formData.append("image", data.image);
    }

    filledPairs.forEach((pair, index) => {
      if (pair.leftImage) {
        formData.append(`pairs[${index}][leftImage]`, pair.leftImage);
      }

      if (pair.rightImage) {
        formData.append(`pairs[${index}][rightImage]`, pair.rightImage);
      }
    });

    try {
      const result = await createGame(formData);
      console.log("SUCCESS:", result);

      router.push("/profile/games");
    } catch (error: any) {
      console.error(error);
      setStepError(error.message || "Something went wrong. Try again.");
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex items-center justify-center gap-3 mb-10">
        <div
          className={`w-3 h-3 rounded-full transition-colors duration-200 ${
            step === 1 ? "bg-main1 shadow-glow-main1" : "bg-main1/40"
          }`}
        />
        <div className="w-12 h-px bg-border1-strong" />
        <div
          className={`w-3 h-3 rounded-full transition-colors duration-200 ${
            step === 2
              ? "bg-main2 shadow-glow-main2"
              : "border border-border1-strong"
          }`}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="">
        {step === 1 && <CreateGameForm />}

        {step === 2 && <CreatePairsForm />}

        <FormError className="mt-12 justify-center">{stepError}</FormError>

        <div className="mt-10">
          {step === 1 && (
            <div className="flex justify-end items-center">
              <Button type="button" variant="primary" onClick={handleNext}>
                Next
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setStepError(null);
                  setStep(1);
                }}
              >
                Previous
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Game"}
              </Button>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
