export type TableRefType = {
  refetch: () => void;
};
export interface Blog {
  id: number;
  categoryId: number;
  image: string;
  title: {
    arabic: string;
    english: string;
  };;
  status: string;
  description: {
    arabic: string;
    english: string;
  };
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  CreatedUser: {
    name: string;
  };
  Category: {
    name: string;
  };
}

export interface ApiResponse {
  data: Blog[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
