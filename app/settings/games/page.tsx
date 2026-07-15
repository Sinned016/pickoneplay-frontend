import EmptyState from "@/components/ui/EmptyState";
import { Gamepad2 } from "lucide-react";

export default function MyGames() {
  return (
    <EmptyState
      icon={Gamepad2}
      title="My games"
      description="Manage the games you've created — coming soon."
    />
  );
}
