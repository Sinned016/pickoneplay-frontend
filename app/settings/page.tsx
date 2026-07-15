import EmptyState from "@/components/ui/EmptyState";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <EmptyState
      icon={SettingsIcon}
      title="Settings"
      description="Account settings are coming soon."
    />
  );
}
