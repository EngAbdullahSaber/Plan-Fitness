export type TableRefType = {
  refetch: () => void;
};
export interface Category {
  id: string;
  name: {
    arabic: string;
    english: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ApiResponse {
  code: number;
  message: string;
  data: Category[];
  totalItems: number;
}
