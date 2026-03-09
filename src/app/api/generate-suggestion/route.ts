import OpenAI from 'openai';

// NOTE: We are deliberately NOT using any helpers from the 'ai' package
// to avoid version incompatibility issues. We will build the stream manually.

const openai = new OpenAI();

export const runtime = 'edge';

function buildPrompt(orderData: any, customizationText: string): string {
  const { recipeType, size, sponge, filling, coverage } = orderData;

  let prompt = `Actúa como un asistente experto de la pastelería "Crazy Bakery". Un cliente está personalizando un pedido y necesita ayuda para refinar su idea.`;
  prompt += `\n\nEl cliente ha seleccionado lo siguiente:\n`;
  prompt += `- Tipo: ${recipeType?.nombre || 'No especificado'}\n`;
  if (size) {
    prompt += `- Tamaño: ${size.nombre} (para ${size.porciones} porciones)\n`;
  }
  prompt += `- Bizcocho: ${sponge?.nombre || 'No especificado'}\n`;
  prompt += `- Relleno: ${filling?.nombre || 'No especificado'}\n`;
  prompt += `- Cobertura: ${coverage?.nombre || 'No especificado'}\n`;

  prompt += `\nLa idea inicial del cliente para la decoración es: "${customizationText}"\n`;

  prompt += `\nAhora, aplica tus conocimientos de pastelería siguiendo estas reglas estrictas:\n`;
  prompt += `1.  **Toppings:** Eres libre de usar y sugerir creativamente cualquier topping que encaje con la descripción del cliente (chispas, frutas, perlas de azúcar, etc.).\n`;
  prompt += `2.  **Imágenes:** Puedes proponer decoraciones que incluyan imágenes impresas en papel de arroz. Son una excelente opción para temas específicos.\n`;
  prompt += `3.  **Figuras 3D:** NO puedes crear figuras en 3D.\n`;
  prompt += `4.  **Formato:** Tu respuesta debe ser una única descripción mejorada y detallada de la decoración final. No ofrezcas varias opciones. Debe ser un párrafo coherente y atractivo que el cliente pueda leer y confirmar.\n`;
  prompt += `5.  **Tono:** Sé amable, creativo y describe el pastel de una manera que suene deliciosa y visualmente atractiva.\n`;
  prompt += `6.  **Regla Crítica de Derechos de Autor:** Si el cliente solicita un personaje famoso con derechos de autor (por ejemplo, 'Mickey Mouse', 'Elsa', 'Spider-Man', personajes de anime, etc.), DEBES OBLIGATORIAMENTE reemplazar el nombre explícito por una descripción genérica que evoque al personaje sin nombrarlo. Por ejemplo, en lugar de "decorado con Mickey Mouse", debes proponer "decorado con la figura de un alegre ratoncito de orejas grandes y redondas y pantalones cortos rojos". Este paso es fundamental para evitar infracciones de derechos de autor en la generación de la propuesta visual.\n`;
  prompt += `7.  **Originalidad:** Todas las propuestas deben ser creaciones originales para "Crazy Bakery". No imites el estilo de otros pasteleros, artistas o marcas registradas. Inspírate en la petición del cliente para crear un diseño nuevo y único.\n`;


  prompt += `\nBasado en toda esta información, genera ahora la descripción de la decoración final para el pastel.\n`;

  return prompt;
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    console.error('¡Error Crítico! La variable de entorno OPENAI_API_KEY no está configurada.');
    return new Response('Error de configuración del servidor: la clave de API no está disponible.', { status: 500 });
  }

  try {
    const { orderData, customizationText } = await req.json();

    if (!orderData || !customizationText) {
      return new Response('Faltan datos en la solicitud', { status: 400 });
    }

    const systemPrompt = buildPrompt(orderData, customizationText);

    // 1. Call the OpenAI API directly, requesting a stream
    const openaiResponse = await openai.chat.completions.create({
      model: process.env.OPENAI_API_MODEL || 'gpt-5-mini',
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: customizationText },
      ],
    });

    // 2. Create a standard ReadableStream to send to the client
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        // Iterate over each chunk as it arrives from OpenAI
        for await (const chunk of openaiResponse) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            // Send the text chunk to the client
            controller.enqueue(encoder.encode(text));
          }
        }
        // Close the stream when OpenAI is done
        controller.close();
      },
    });

    // 3. Return a standard Response with the stream
    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error: any) {
    console.error('\n--- ¡Error Detallado al llamar a la API de OpenAI! ---\n');
    console.error(error);
    return new Response(`Error interno al generar la sugerencia: ${error.message}` , { status: 500 });
  }
}
