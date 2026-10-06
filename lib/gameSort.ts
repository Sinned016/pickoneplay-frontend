export type SortOption = "newest" | "popular" | "az";

export const sortLabels: Record<SortOption, string> = {
  newest: "Newest",
  popular: "Most played",
  az: "A – Z",
};

export function isSortOption(value: string | undefined): value is SortOption {
  return value !== undefined && value in sortLabels;
}
