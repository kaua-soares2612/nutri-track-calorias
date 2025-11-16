"use client";

import { Meal } from '@/lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

interface ProgressChartProps {
  meals: Meal[];
  dailyGoal: number;
}

export function ProgressChart({ meals, dailyGoal }: ProgressChartProps) {
  // Agrupar refeições por dia (últimos 7 dias)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const chartData = last7Days.map(date => {
    const dateString = date.toDateString();
    const dayMeals = meals.filter(
      meal => new Date(meal.meal_time).toDateString() === dateString
    );
    
    const totalCalories = dayMeals.reduce(
      (sum, meal) => sum + meal.total_calories,
      0
    );

    return {
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      calories: totalCalories,
      goal: dailyGoal,
    };
  });

  return (
    <div className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-emerald-100">
          <Calendar className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Progresso Semanal</h3>
          <p className="text-sm text-gray-500">Últimos 7 dias</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '12px',
            }}
          />
          <Line
            type="monotone"
            dataKey="goal"
            stroke="#d1d5db"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Meta"
          />
          <Line
            type="monotone"
            dataKey="calories"
            stroke="url(#colorGradient)"
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7 }}
            name="Calorias"
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
          <span className="text-sm text-gray-600">Consumido</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-dashed border-gray-300" />
          <span className="text-sm text-gray-600">Meta diária</span>
        </div>
      </div>
    </div>
  );
}
