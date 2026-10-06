"use client";

import { Avatar } from "@/components/profile/profileHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { cn } from "@/lib/utils";
import { updateSettings } from "@/services/profile";
import { useAuth } from "@/store/useAuth";
import { User } from "@/types/User";
import { Check, CheckCircle2, KeyRound, Mail, UserCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useEffect, useState } from "react";

const USERNAME_MAX = 12;
const SUCCESS_MS = 3500;

export default function Settings() {
  const user = useAuth((state) => state.user);

  return (
    <div className="max-w-3xl mx-auto">
      {user && <SettingsForm key={user.id} user={user} />}
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  description,
  accent,
  index,
  children,
}: {
  icon: typeof UserCircle;
  title: string;
  description: string;
  accent: "main1" | "main2";
  index: number;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
    >
      <Card variant="surface1" radius="2xl" padding="lg">
        <div className="flex items-start gap-4 mb-6">
          <div
            className={cn(
              "flex items-center justify-center w-11 h-11 shrink-0 rounded-xl",
              accent === "main1" ? "bg-main1/15 text-main1" : "bg-main2/15 text-main2",
            )}
          >
            <Icon size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-sm text-muted">{description}</p>
          </div>
        </div>

        {children}
      </Card>
    </motion.div>
  );
}

function SettingsForm({ user }: { user: User }) {
  const setUser = useAuth((state) => state.setUser);

  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isDirty =
    username.trim() !== user.username || password.trim().length > 0;

  // Let the success toast fade away on its own.
  useEffect(() => {
    if (!success) return;
    const timeout = setTimeout(() => setSuccess(false), SUCCESS_MS);
    return () => clearTimeout(timeout);
  }, [success]);

  const handleSave = async () => {
    setError(null);
    setSuccess(false);

    if (password.trim().length > 0 && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const payload: { username?: string; password?: string } = {};

    if (username.trim() !== user.username) {
      payload.username = username.trim();
    }

    if (password.trim().length > 0) {
      payload.password = password.trim();
    }

    if (Object.keys(payload).length === 0) return;

    setSaving(true);

    try {
      const result = await updateSettings(payload);

      setUser({ ...user, username: result.data.username });

      setPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  function resetChanges() {
    setUsername(user.username);
    setPassword("");
    setConfirmPassword("");
    setError(null);
  }

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="flex flex-col gap-6 pb-28">
      <Section
        icon={UserCircle}
        title="Profile"
        description="This is how other players see you."
        accent="main1"
        index={0}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar name={username.trim() || user.username} size="md" />

          <div className="flex-1 w-full flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-medium text-text1" htmlFor="username">
                Username
              </label>
              <span
                className={cn(
                  "text-xs tabular-nums",
                  username.length > USERNAME_MAX ? "text-error" : "text-muted",
                )}
              >
                {username.length}/{USERNAME_MAX}
              </span>
            </div>
            <Input
              id="username"
              icon={UserCircle}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
      </Section>

      <Section
        icon={KeyRound}
        title="Security"
        description="Leave blank to keep your current password."
        accent="main2"
        index={1}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-text1" htmlFor="password">
              New password
            </label>
            <PasswordInput
              id="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-text1" htmlFor="confirmPassword">
              Confirm new password
            </label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Repeat password"
              error={passwordsMismatch}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <AnimatePresence>
          {(passwordsMatch || passwordsMismatch) && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                "mt-3 flex items-center gap-1.5 text-sm",
                passwordsMatch ? "text-success" : "text-error",
              )}
            >
              {passwordsMatch ? <Check size={14} /> : <X size={14} />}
              {passwordsMatch ? "Passwords match" : "Passwords don't match yet"}
            </motion.p>
          )}
        </AnimatePresence>
      </Section>

      <Section
        icon={Mail}
        title="Account"
        description="Details tied to your login."
        accent="main1"
        index={2}
      >
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl border border-border1 bg-surface2 p-4">
            <dt className="text-muted">Email</dt>
            <dd className="mt-1 font-medium text-text1 truncate">{user.email}</dd>
          </div>
          <div className="rounded-xl border border-border1 bg-surface2 p-4">
            <dt className="text-muted">Member since</dt>
            <dd className="mt-1 font-medium text-text1">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </dd>
          </div>
        </dl>
      </Section>

      {/* Save bar — slides up while there are unsaved changes or something to report */}
      <AnimatePresence>
        {(isDirty || error || success) && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-4 inset-x-4 z-40 mx-auto max-w-3xl"
          >
            <div className="glow-border flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-background/90 backdrop-blur-xl p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]">
              <div className="text-sm">
                {success ? (
                  <span className="flex items-center gap-2 text-success font-medium">
                    <CheckCircle2 size={18} />
                    Your changes have been saved.
                  </span>
                ) : error ? (
                  <FormError>{error}</FormError>
                ) : (
                  <span className="text-text1">You have unsaved changes.</span>
                )}
              </div>

              {isDirty && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resetChanges}
                    disabled={saving}
                  >
                    Reset
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    disabled={saving}
                    onClick={handleSave}
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
