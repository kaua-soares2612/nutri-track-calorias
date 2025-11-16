"use client";

import { Meal } from '@/lib/supabase';
import { Flame, Beef, Wheat, Droplet, Clock } from 'lucide-react';

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-xl">
      {/* Imagem da refeição */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={meal.image_url}
          alt="Refeição"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTime(meal.meal_time)}</span>
        </div>
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium">
          {formatDate(meal.meal_time)}
        </div>
      </div>

      {/* Informações nutricionais */}
      <div className="p-5">
        {/* Calorias totais */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-gray-600">Calorias</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            {meal.total_calories}
            <span className="text-sm text-gray-500 ml-1">kcal</span>
          </span>
        </div>

        {/* Macronutrientes */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col items-center p-3 rounded-xl bg-blue-50">
            <Beef className="w-4 h-4 text-blue-600 mb-1" />
            <span className="text-xs text-gray-600 mb-1">Proteína</span>
            <span className="text-sm font-bold text-blue-600">
              {Math.round(meal.protein_grams)}g
            </span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-amber-50">
            <Wheat className="w-4 h-4 text-amber-600 mb-1" />
            <span className="text-xs text-gray-600 mb-1">Carbos</span>
            <span className="text-sm font-bold text-amber-600">
              {Math.round(meal.carbs_grams)}g
            </span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-purple-50">
            <Droplet className="w-4 h-4 text-purple-600 mb-1" />
            <span className="text-xs text-gray-600 mb-1">Gordura</span>
            <span className="text-sm font-bold text-purple-600">
              {Math.round(meal.fat_grams)}g
            </span>
          </div>
        </div>

        {/* Alimentos detectados */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Alimentos detectados
          </span>
          <div className="flex flex-wrap gap-2">
            {meal.foods_detected.map((food, index) => (
              <div
                key={index}
                className="px-3 py-1.5 rounded-full bg-gray-50 text-xs text-gray-700 border border-gray-200"
              >
                {food.name} • {food.quantity}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
