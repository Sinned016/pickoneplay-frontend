import { LucideIcon, Sparkles } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  icon?: LucideIcon;
};

export default function EmptyState({
  title,
  description,
  icon: Icon = Sparkles,
}: Props) {
  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 min-h-[50vh] flex flex-col items-center justify-center text-center gap-4">
      <div className="rounded-full p-4 bg-gradient-to-br from-main1/15 to-main2/15 border border-border1">
        <Icon className="w-8 h-8 text-main1" />
      </div>
      <h1 className="text-2xl md:text-3xl font-black text-text1">{title}</h1>
      {description && (
        <p className="text-muted max-w-md">{description}</p>
      )}
    </div>
  );
}
