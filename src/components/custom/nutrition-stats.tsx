"use client";

import { Meal } from '@/lib/supabase';
import { Flame, TrendingUp, Target } from 'lucide-react';

interface NutritionStatsProps {
  meals: Meal[];
  dailyGoal: number;
}

export function NutritionStats({ meals, dailyGoal }: NutritionStatsProps) {
  // Calcular totais do dia
  const today = new Date().toDateString();
  const todayMeals = meals.filter(
    meal => new Date(meal.meal_time).toDateString() === today
  );

  const totalCalories = todayMeals.reduce(
    (sum, meal) => sum + meal.total_calories,
    0
  );
  const totalProtein = todayMeals.reduce(
    (sum, meal) => sum + meal.protein_grams,
    0
  );
  const totalCarbs = todayMeals.reduce(
    (sum, meal) => sum + meal.carbs_grams,
    0
  );
  const totalFat = todayMeals.reduce(
    (sum, meal) => sum + meal.fat_grams,
    0
  );

  const calorieProgress = (totalCalories / dailyGoal) * 100;
  const remaining = Math.max(0, dailyGoal - totalCalories);

  return (
    <div className="space-y-6">
      {/* Card principal de calorias */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5" />
            <span className="text-emerald-100 text-sm font-medium">Hoje</span>
          </div>
          
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-6xl font-bold">{totalCalories}</span>
            <span className="text-2xl text-emerald-100">/ {dailyGoal} kcal</span>
          </div>

          {/* Barra de progresso */}
          <div className="relative h-3 bg-white/20 rounded-full overflow-hidden mb-4">
            <div
              className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-500"
              style={{ width: `${Math.min(calorieProgress, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="text-emerald-100">
                {remaining > 0 ? `${remaining} kcal restantes` : 'Meta atingida!'}
              </span>
            </div>
            <span className="font-medium">{Math.round(calorieProgress)}%</span>
          </div>
        </div>
      </div>

      {/* Cards de macronutrientes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Proteína</span>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {Math.round(totalProtein)}g
          </div>
          <div className="text-xs text-gray-500">
            {Math.round((totalProtein / totalCalories) * 100 * 4) || 0}% do total
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Carboidratos</span>
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {Math.round(totalCarbs)}g
          </div>
          <div className="text-xs text-gray-500">
            {Math.round((totalCarbs / totalCalories) * 100 * 4) || 0}% do total
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Gorduras</span>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {Math.round(totalFat)}g
          </div>
          <div className="text-xs text-gray-500">
            {Math.round((totalFat / totalCalories) * 100 * 9) || 0}% do total
          </div>
        </div>
      </div>
    </div>
  );
}
