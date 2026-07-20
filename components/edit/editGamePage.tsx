"use client";

import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import EditGameForm from "@/components/edit/editGameForm";
import EditPairsForm from "@/components/edit/editPairsForm";
import { updateMyGame } from "@/services/profile";
import { EditGameFormData } from "@/types/EditGameFormData";
import { GameWithPairs } from "@/types/Game";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

type Props = {
  game: GameWithPairs;
};

export default function EditGamePage({ game }: Props) {
  const router = useRouter();

  const methods = useForm<EditGameFormData>({
    defaultValues: {
      title: game.title,
      description: game.description,
      category: game.category,
      tags: game.tags,
      image: game.image,
      pairs: game.pairs.map((pair) => ({
        id: pair.id,
        leftName: pair.leftName,
        leftImage: pair.leftImage,
        rightName: pair.rightName,
        rightImage: pair.rightImage,
      })),
    },
  });

  const {
    handleSubmit,
    setError: setFormFieldError,
    clearErrors,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: EditGameFormData) => {
    clearErrors();

    const filledPairs = data.pairs.filter(
      (p) => p.leftName.trim() && p.rightName.trim(),
    );

    if (filledPairs.length < 3) {
      setFormFieldError("root", {
        message: "You must fill at least 3 pairs.",
      });
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
          leftImage: typeof pair.leftImage === "string" ? pair.leftImage : null,
          rightImage:
            typeof pair.rightImage === "string" ? pair.rightImage : null,
        })),
      ),
    );

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    filledPairs.forEach((pair, index) => {
      if (pair.leftImage instanceof File) {
        formData.append(`pairs[${index}][leftImage]`, pair.leftImage);
      }

      if (pair.rightImage instanceof File) {
        formData.append(`pairs[${index}][rightImage]`, pair.rightImage);
      }
    });

    try {
      await updateMyGame(game.id, formData);
      router.push("/profile/games");
    } catch (error) {
      setFormFieldError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Try again.",
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <EditGameForm />

        <div className="mt-10 border-t border-border1 pt-10">
          <EditPairsForm />
        </div>

        <FormError className="mt-8 justify-center">
          {methods.formState.errors.root?.message}
        </FormError>

        <div className="flex justify-between items-center mt-10">
          <Button variant="secondary" href="/profile/games">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
