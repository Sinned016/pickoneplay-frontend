export type Game = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  createdBy: string;
  createdAt: string;
  category: string;
  tags: string[];
  plays: number;
};

export type Pair = {
  id: string;
  gameId: string;
  leftName: string;
  leftImage: string | null;
  leftScore: number;
  rightName: string;
  rightImage: string | null;
  rightScore: number;
  createdAt: string;
};

export type GameWithPairs = Game & {
  pairs: Pair[];
};
