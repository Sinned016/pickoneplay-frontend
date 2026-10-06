"use client";

import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import EditGameForm from "@/components/edit/editGameForm";
import EditPairsForm from "@/components/edit/editPairsForm";
import { updateMyGame } from "@/services/profile";
import { EditGameFormData } from "@/types/EditGameFormData";
import { GameWithPairs } from "@/types/Game";
import { Loader2, Save } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 pb-28">
        <EditSection step={1} title="Game details" accent="main1">
          <EditGameForm />
        </EditSection>

        <EditSection step={2} title="Rounds" accent="main2">
          <EditPairsForm />
        </EditSection>

        {/* Sticky action bar */}
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.3 }}
          className="fixed bottom-4 inset-x-4 z-40 mx-auto max-w-5xl"
        >
          <div className="glow-border flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-background/90 backdrop-blur-xl p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]">
            <div className="text-sm">
              {methods.formState.errors.root?.message ? (
                <motion.div
                  key={methods.formState.errors.root.message}
                  animate={{ x: [0, -8, 8, -6, 6, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <FormError>{methods.formState.errors.root.message}</FormError>
                </motion.div>
              ) : (
                <span className="text-muted">
                  {methods.formState.isDirty
                    ? "You have unsaved changes."
                    : "No changes yet."}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" href="/profile/games">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </motion.div>
      </form>
    </FormProvider>
  );
}

function EditSection({
  step,
  title,
  accent,
  children,
}: {
  step: number;
  title: string;
  accent: "main1" | "main2";
  children: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: (step - 1) * 0.1, ease: "easeOut" }}
      className="rounded-2xl border border-border1 bg-surface1 backdrop-blur-xl shadow-md p-5 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <span
          className={
            accent === "main1"
              ? "flex items-center justify-center w-9 h-9 rounded-full bg-main1 text-black font-black shadow-glow-main1"
              : "flex items-center justify-center w-9 h-9 rounded-full bg-main2 text-black font-black shadow-glow-main2"
          }
        >
          {step}
        </span>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>

      {children}
    </motion.section>
  );
}
