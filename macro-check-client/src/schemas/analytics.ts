// data str coming from backend
export interface Log { // Add export here
  id: number;
  description: string;
  meal_type: string;
  calories: number;
  date: string;
  protein: number;
  carbs: number;
  fat: number;
}
export interface DailySummary {
  date: string;
  goal_calories: number;
  actual_calories: number;
  remaining_calories: number;
  goal_protein: number;
  actual_protein: number;
  remaining_protein: number;
  goal_carbs: number;
  actual_carbs: number;
  remaining_carbs: number;
  goal_fat: number;
  actual_fat: number;
  remaining_fat: number;
  logs: Log[];
}