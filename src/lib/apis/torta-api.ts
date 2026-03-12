import { apiFetch, BASE_URL } from '@/lib/api-fetch';

/**
 * Interfaz para la solicitud de creación de una torta.
 * Basado en el CURL proporcionado.
 */
export interface CrearTortaRequest {
  bizcochoId: number;
  rellenoId: number;
  cuberturaId: number;
  tamanoId: number;
}

/**
 * Interfaz para la respuesta de la creación de una torta.
 * Solo se define el campo `id` que es el importante, pero se pueden añadir más si es necesario.
 */
export interface CrearTortaResponse {
  id: number;
}

/**
 * Crea una nueva torta en el backend.
 * @param data - Los datos de la torta a crear (IDs de ingredientes y tamaño).
 * @returns Una promesa que resuelve con la respuesta del backend, incluyendo el ID de la torta creada.
 */
export async function crearTorta(data: CrearTortaRequest): Promise<CrearTortaResponse> {
  const response = await apiFetch(`${BASE_URL}/torta`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    cache: 'no-store', // No cachear esta solicitud
  });

  if (!response.ok) {
    console.error('Error al crear la torta:', response);
    const errorData = await response.json().catch(() => ({ message: 'No se pudo decodificar el error del servidor.' }));
    throw new Error(errorData.message || 'Ocurrió un error inesperado al crear la torta.');
  }

  return response.json();
}
