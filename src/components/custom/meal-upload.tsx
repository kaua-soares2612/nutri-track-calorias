"use client";

import { useState, useRef } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MealUploadProps {
  userId: string;
  onMealAdded: () => void;
}

export function MealUpload({ userId, onMealAdded }: MealUploadProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mostrar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Analisar refeição
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', userId);

      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Erro na análise');

      const data = await response.json();
      console.log('Refeição analisada:', data);
      
      onMealAdded();
      setPreview(null);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao analisar refeição. Tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isAnalyzing}
      />

      {preview && isAnalyzing ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500/10 to-teal-600/10 p-8 backdrop-blur-sm border border-emerald-500/20">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-2xl mb-4"
          />
          <div className="flex items-center justify-center gap-3 text-emerald-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-lg font-medium">Analisando refeição com IA...</span>
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
          className="w-full group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-12 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative flex flex-col items-center gap-4 text-white">
            <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm">
              <Camera className="w-12 h-12" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Adicionar Refeição</h3>
              <p className="text-emerald-50 text-sm">
                Tire uma foto ou selecione da galeria
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-50">
              <Upload className="w-4 h-4" />
              <span>IA analisará automaticamente</span>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
