export type CreateGameFormData = {
  title: string;
  description: string;
  image?: File | null;
  category: string;
  tags: string[];

  pairs: {
    leftName: string;
    leftImage?: File | null;
    rightName: string;
    rightImage?: File | null;
  }[];
};
