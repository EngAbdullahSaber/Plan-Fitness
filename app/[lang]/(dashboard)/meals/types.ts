interface MealItem {
  id: number;
  description: {
    arabic: string;
    english: string;
  };
  mealId: number;
  createdAt: string;
  updatedAt: string;
}

interface Meal {
  id: number;
  image: string;
  type: string;
  totalCalory: number;
  proteins: number;
  fat: number;
  carp: number;
  isRequest: boolean;
  createdAt: string;
  updatedAt: string;
  mealItem: MealItem[];
}

interface MealApiResponse {
  code: number;
  message: {
    arabic: string;
    english: string;
  };
  data: Meal[];
  totalItems?: number;
}
