import EmptyState from "@/components/ui/EmptyState";
import { Hammer } from "lucide-react";

export default function Game() {
  return (
    <EmptyState
      icon={Hammer}
      title="Game details"
      description="This page is still under construction."
    />
  );
}
