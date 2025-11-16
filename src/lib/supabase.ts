import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  name?: string;
  daily_calorie_goal: number;
  created_at: string;
};

export type Meal = {
  id: string;
  user_id: string;
  image_url: string;
  foods_detected: Array<{
    name: string;
    quantity: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  total_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  meal_time: string;
  created_at: string;
};
