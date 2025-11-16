import { NextRequest, NextResponse } from 'next/server';
import { analyzeMealImage } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const userId = formData.get('userId') as string;

    if (!image || !userId) {
      return NextResponse.json(
        { error: 'Imagem e ID do usuário são obrigatórios' },
        { status: 400 }
      );
    }

    // Upload da imagem para o Supabase Storage
    const fileName = `${userId}/${Date.now()}-${image.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('meal-images')
      .upload(fileName, image);

    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      return NextResponse.json(
        { error: 'Erro ao fazer upload da imagem' },
        { status: 500 }
      );
    }

    // Obter URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from('meal-images')
      .getPublicUrl(fileName);

    // Analisar imagem com OpenAI
    const analysis = await analyzeMealImage(publicUrl);

    // Salvar refeição no banco
    const { data: meal, error: mealError } = await supabase
      .from('meals')
      .insert({
        user_id: userId,
        image_url: publicUrl,
        foods_detected: analysis.foods,
        total_calories: analysis.total_calories,
        protein_grams: analysis.total_protein,
        carbs_grams: analysis.total_carbs,
        fat_grams: analysis.total_fat,
      })
      .select()
      .single();

    if (mealError) {
      console.error('Erro ao salvar refeição:', mealError);
      return NextResponse.json(
        { error: 'Erro ao salvar refeição' },
        { status: 500 }
      );
    }

    return NextResponse.json({ meal, analysis });
  } catch (error) {
    console.error('Erro na análise:', error);
    return NextResponse.json(
      { error: 'Erro ao processar refeição' },
      { status: 500 }
    );
  }
}
