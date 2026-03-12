import { apiFetch, BASE_URL } from '@/lib/api-fetch';

/**
 * Interfaz para la solicitud de creación de una receta.
 */
export interface CrearRecetaRequest {
  tipoReceta: 'TORTA' | 'CUPCAKE';
  tortaId: number;
  cantidad: number;
  prompt: string | null;
  imagenUrl: string | null;
}

/**
 * Interfaz para la respuesta de la creación de una receta.
 * Se define el `id` como campo principal para los siguientes pasos del flujo.
 */
export interface CrearRecetaResponse {
  id: number;
  // Se pueden añadir más campos de la respuesta si son necesarios en el futuro
}

/**
 * Crea una nueva receta en el backend.
 * @param data - Los datos de la receta a crear.
 * @returns Una promesa que resuelve con la respuesta del backend, incluyendo el ID de la receta creada.
 */
export async function crearReceta(data: CrearRecetaRequest): Promise<CrearRecetaResponse> {
  const response = await apiFetch(`${BASE_URL}/receta`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Error al crear la receta:', response);
    const errorData = await response.json().catch(() => ({ message: 'No se pudo decodificar el error del servidor.' }));
    throw new Error(errorData.message || 'Ocurrió un error inesperado al crear la receta.');
  }

  return response.json();
}
