"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import { updateSettings } from "@/services/profile";
import { useAuth } from "@/store/useAuth";
import { User } from "@/types/User";
import { useState } from "react";

export default function Settings() {
  const user = useAuth((state) => state.user);

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-black text-text1 mb-6">
        Settings
      </h1>

      {user && <SettingsForm key={user.id} user={user} />}
    </div>
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

  return (
    <Card
      variant="surface1"
      radius="2xl"
      padding="lg"
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <label className="font-medium text-lg" htmlFor="username">
          Username
        </label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-lg" htmlFor="password">
          New password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Leave blank to keep current password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-lg" htmlFor="confirmPassword">
          Confirm new password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <FormError>{error}</FormError>
      {success && (
        <p className="text-success text-sm">Your changes have been saved.</p>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          variant="primary"
          disabled={!isDirty || saving}
          onClick={handleSave}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </Card>
  );
}
