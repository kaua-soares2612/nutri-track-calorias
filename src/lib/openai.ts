import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function analyzeMealImage(imageUrl: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analise esta imagem de refeição e retorne um JSON com a seguinte estrutura:
{
  "foods": [
    {
      "name": "nome do alimento",
      "quantity": "quantidade estimada (ex: 150g, 1 unidade, 200ml)",
      "calories": número de calorias,
      "protein": gramas de proteína,
      "carbs": gramas de carboidratos,
      "fat": gramas de gordura
    }
  ],
  "total_calories": soma total de calorias,
  "total_protein": soma total de proteínas,
  "total_carbs": soma total de carboidratos,
  "total_fat": soma total de gorduras
}

Seja preciso nas estimativas de quantidade e valores nutricionais. Se não conseguir identificar algum alimento, não inclua no resultado.`
          },
          {
            type: "image_url",
            image_url: { url: imageUrl }
          }
        ]
      }
    ],
    response_format: { type: "json_object" },
    max_tokens: 1000,
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content || '{}');
}
