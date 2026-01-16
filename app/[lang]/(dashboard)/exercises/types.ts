export type TableRefType = {
  refetch: () => void;
};
export interface Category {
  id: string;
  name: string;
  nameAr: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
export interface Exercises {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  url: string;
  count: number;
  duration: string;
  difficulty: string;
  calory: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  CreatedBy: number;
  Category: {
    id: number;
    name: string;
  };
}
export interface ApiResponse {
  code: number;
  message: string;
  data: Category[];
  totalItems: number;
}
