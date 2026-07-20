export type EditPairFormData = {
  id?: string;
  leftName: string;
  leftImage: File | string | null;
  rightName: string;
  rightImage: File | string | null;
};

export type EditGameFormData = {
  title: string;
  description: string;
  image: File | string | null;
  category: string;
  tags: string[];

  pairs: EditPairFormData[];
};
