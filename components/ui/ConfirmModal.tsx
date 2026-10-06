"use client";

import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import { AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  error,
  onConfirm,
  onCancel,
}: Props) {
  // Keep the last text shown while the modal animates out — the caller usually
  // clears the data the title was built from at the same moment it closes.
  const [shown, setShown] = useState({ title, description });
  if (open && (shown.title !== title || shown.description !== description)) {
    setShown({ title, description });
  }

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !loading && onCancel()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="max-w-sm w-full rounded-2xl border border-error/30 bg-background/95 backdrop-blur-xl p-6 md:p-8 shadow-[0_0_0_1px_rgba(248,113,113,0.15),0_30px_80px_-20px_rgba(248,113,113,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ rotate: -15, scale: 0.6 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.05 }}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-error/15 text-error mb-4"
            >
              <AlertTriangle size={24} />
            </motion.div>

            <h2 className="text-xl font-bold text-white break-words">{shown.title}</h2>
            {shown.description && (
              <p className="text-muted text-sm mt-2">{shown.description}</p>
            )}

            <FormError className="mt-3">{error}</FormError>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                {cancelLabel}
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? "Deleting..." : confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
