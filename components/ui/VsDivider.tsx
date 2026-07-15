import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  className?: string;
};

export default function VsDivider({ label = "VS", className }: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-full p-[1.5px] bg-gradient-to-br from-main1 to-main2 shadow-glow-duel",
        className,
      )}
    >
      <div className="flex items-center justify-center w-full h-full rounded-full bg-surface2 backdrop-blur-md">
        <span className="text-xs md:text-sm font-black tracking-wide bg-gradient-to-br from-main1 to-main2 bg-clip-text text-transparent">
          {label}
        </span>
      </div>
    </div>
  );
}
