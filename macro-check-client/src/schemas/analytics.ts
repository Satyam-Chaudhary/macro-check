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
interface DailyBreakdownItem {
  date: string;
  calories: number;
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

export interface WeeklySummary {
  start_date: string;
  end_date: string;
  total_logs: number;
  avg_daily_calories: number;
  avg_daily_protein: number;
  days_calorie_goal_met: number;
  avg_calorie_surplus_deficit: number;
  natural_language_summary: string;
  daily_breakdown: DailyBreakdownItem[];
}