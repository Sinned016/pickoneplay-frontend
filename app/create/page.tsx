"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import VsDivider from "@/components/ui/VsDivider";
import CreateGameForm from "@/components/create/createGameForm";
import CreatePairsForm from "@/components/create/createPairsForm";
import CreateReview from "@/components/create/createReview";
import { cn } from "@/lib/utils";
import { useForm, FormProvider } from "react-hook-form";
import { CreateGameFormData } from "@/types/CreateGameFormData";
import { createGame } from "@/services/games";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const STEPS = [
  { label: "Details", accent: "main1" },
  { label: "Rounds", accent: "main2" },
  { label: "Review", accent: "main1" },
] as const;

const MIN_PAIRS = 3;
const SUCCESS_HOLD_MS = 1400;

export default function Create() {
  const [step, setStep] = useState(1);
  // +1 when moving forward, -1 when going back — drives the slide direction.
  const [direction, setDirection] = useState(1);
  const [stepError, setStepError] = useState<string | null>(null);
  const [created, setCreated] = useState(false);
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  console.log("SAVED VALUES: ", methods.getValues());

  function goTo(next: number) {
    setStepError(null);
    setDirection(next > step ? 1 : -1);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleNext = async () => {
    setStepError(null);

    if (step === 1) {
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
        setStepError(
          values.tags.length === 0 && values.title.trim() && values.description.trim()
            ? "Add at least one tag."
            : "Please fill in the required fields.",
        );
        return;
      }

      goTo(2);
      return;
    }

    if (step === 2) {
      const filledPairs = getValues().pairs.filter(
        (p) => p.leftName.trim() && p.rightName.trim(),
      );

      if (filledPairs.length < MIN_PAIRS) {
        setStepError(`You must fill at least ${MIN_PAIRS} pairs.`);
        return;
      }

      goTo(3);
    }
  };

  const onSubmit = async (data: CreateGameFormData) => {
    console.log("FINAL SUBMIT:", data);
    setStepError(null);

    const filledPairs = data.pairs.filter(
      (p) => p.leftName.trim() && p.rightName.trim(),
    );

    if (filledPairs.length < MIN_PAIRS) {
      setStepError(`You must fill at least ${MIN_PAIRS} pairs.`);
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

      // Celebrate for a moment before heading to the profile.
      setCreated(true);
      await new Promise((resolve) => setTimeout(resolve, SUCCESS_HOLD_MS));

      router.push("/profile/games");
    } catch (error: any) {
      console.error(error);
      setStepError(error.message || "Something went wrong. Try again.");
    }
  };

  return (
    <FormProvider {...methods}>
      {/* Stepper */}
      <ol className="flex items-center justify-center gap-2 sm:gap-3 mb-10">
        {STEPS.map((s, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
          const isMain1 = s.accent === "main1";

          return (
            <li key={s.label} className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                disabled={!done}
                onClick={() => goTo(n)}
                className="flex items-center gap-2 disabled:cursor-default cursor-pointer"
              >
                <motion.span
                  animate={{ scale: active ? 1.1 : 1 }}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full text-sm font-black transition-colors duration-300",
                    active || done
                      ? isMain1
                        ? "bg-main1 text-black shadow-glow-main1"
                        : "bg-main2 text-black shadow-glow-main2"
                      : "border border-border1-strong text-muted",
                  )}
                >
                  {done ? <Check size={16} strokeWidth={3} /> : n}
                </motion.span>
                <span
                  className={cn(
                    "hidden sm:inline text-sm font-semibold",
                    active ? "text-white" : "text-muted",
                  )}
                >
                  {s.label}
                </span>
              </button>

              {n < STEPS.length && (
                <div className="relative w-8 sm:w-16 h-0.5 rounded-full bg-border1-strong overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-main1 to-main2"
                    initial={false}
                    animate={{ width: step > n ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <form
        // Enter on earlier steps should advance, not create the game early.
        onSubmit={
          step === STEPS.length
            ? handleSubmit(onSubmit)
            : (e) => {
                e.preventDefault();
                handleNext();
              }
        }
        className="pb-28"
      >
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={{
              enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
              center: { opacity: 1, x: 0 },
              exit: (dir: number) => ({ opacity: 0, x: dir * -60 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-2xl border border-border1 bg-surface1 backdrop-blur-xl shadow-md p-5 sm:p-8"
          >
            {step === 1 && <CreateGameForm />}

            {step === 2 && <CreatePairsForm />}

            {step === 3 && <CreateReview onEditStep={goTo} />}
          </motion.div>
        </AnimatePresence>

        {/* Sticky action bar */}
        <div className="fixed bottom-4 inset-x-4 z-40 mx-auto max-w-5xl">
          <div className="glow-border flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-background/90 backdrop-blur-xl p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]">
            <div className="text-sm min-h-5">
              {stepError ? (
                <motion.div
                  key={stepError}
                  animate={{ x: [0, -8, 8, -6, 6, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <FormError>{stepError}</FormError>
                </motion.div>
              ) : (
                <span className="text-muted">
                  Step {step} of {STEPS.length} · {STEPS[step - 1].label}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => goTo(step - 1)}
                  disabled={isSubmitting}
                >
                  <ArrowLeft size={18} />
                  Back
                </Button>
              )}

              {step < STEPS.length ? (
                <Button type="button" variant="primary" onClick={handleNext}>
                  Next
                  <ArrowRight size={18} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="accent"
                  disabled={isSubmitting || created}
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Sparkles size={18} />
                  )}
                  {isSubmitting ? "Creating..." : "Create Game"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Success moment */}
      <AnimatePresence>
        {created && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-background/90 backdrop-blur-md px-6 text-center"
          >
            {[0, 0.2, 0.4].map((delay) => (
              <motion.span
                key={delay}
                className="absolute w-40 h-40 rounded-full border-2 border-main1/60"
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 1.4, delay, ease: "easeOut" }}
              />
            ))}
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
            >
              <VsDivider size="lg" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h2 className="text-4xl font-black text-white">Game created!</h2>
              <p className="mt-2 text-muted">Taking you to your games…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </FormProvider>
  );
}
