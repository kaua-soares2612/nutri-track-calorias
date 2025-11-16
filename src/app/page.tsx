"use client";

import { useEffect, useState } from 'react';
import { supabase, type Meal } from '@/lib/supabase';
import { MealUpload } from '@/components/custom/meal-upload';
import { MealCard } from '@/components/custom/meal-card';
import { NutritionStats } from '@/components/custom/nutrition-stats';
import { ProgressChart } from '@/components/custom/progress-chart';
import { Utensils, Sparkles } from 'lucide-react';

export default function Home() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ID de usuário demo (em produção, usar autenticação real)
  const userId = 'demo-user-123';
  const dailyGoal = 2000;

  const loadMeals = async () => {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', userId)
        .order('meal_time', { ascending: false })
        .limit(30);

      if (error) throw error;
      setMeals(data || []);
    } catch (error) {
      console.error('Erro ao carregar refeições:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeals();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">
      {/* Header */}
      <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  NutriTrack
                </h1>
                <p className="text-xs text-gray-500">Rastreamento inteligente de nutrição</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">IA Ativada</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Upload Section */}
          <section>
            <MealUpload userId={userId} onMealAdded={loadMeals} />
          </section>

          {/* Stats Section */}
          {!loading && meals.length > 0 && (
            <section>
              <NutritionStats meals={meals} dailyGoal={dailyGoal} />
            </section>
          )}

          {/* Chart Section */}
          {!loading && meals.length > 0 && (
            <section>
              <ProgressChart meals={meals} dailyGoal={dailyGoal} />
            </section>
          )}

          {/* Meals History */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Histórico de Refeições</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {meals.length} {meals.length === 1 ? 'refeição registrada' : 'refeições registradas'}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">Carregando refeições...</p>
                </div>
              </div>
            ) : meals.length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhuma refeição registrada
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Comece tirando uma foto da sua primeira refeição e deixe a IA analisar automaticamente!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>NutriTrack • Rastreamento inteligente de nutrição com IA</p>
            <p className="mt-2">Análise precisa de calorias e macronutrientes</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
