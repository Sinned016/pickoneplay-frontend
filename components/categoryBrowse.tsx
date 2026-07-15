import Card from "@/components/ui/Card";
import Link from "next/link";

type Props = {
  categories: string[];
};

export default function CategoryBrowse({ categories }: Props) {
  if (categories.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto mt-8 mb-16 sm:mb-24 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center text-2xl text-text1 font-semibold">
          Browse by category
        </h2>

        <Link
          href="/games"
          className="text-sm font-medium text-main1 hover:underline"
        >
          See all categories
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            href={`/games?category=${encodeURIComponent(category)}`}
            key={category}
          >
            <Card
              variant="surface1"
              interactive
              radius="xl"
              padding="md"
              className="text-center"
            >
              <p className="text-text1 font-medium capitalize">{category}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
