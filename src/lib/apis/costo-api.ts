import { apiFetch, BASE_URL } from '@/lib/api-fetch';

// Interfaces para la solicitud y respuesta del cálculo de costo
export interface CalcularCostoRequest {
  tipoReceta: 'TORTA' | 'CUPCAKE';
  tamanoId: number;
  ingredientesIds: number[];
  cantidad: number;
}

export interface CalcularCostoResponse {
  valorTotalPedido: number;
}

/**
 * Calcula el costo de un pedido enviando los detalles al backend.
 * @param data - Los datos para la solicitud de cálculo de costo.
 * @returns Una promesa que resuelve con la respuesta del cálculo de costo.
 */
export async function calcularCostoPedido(data: CalcularCostoRequest): Promise<CalcularCostoResponse> {
  const response = await apiFetch(`${BASE_URL}/costo/calcular`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to calculate cost');
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido al calcular el costo.' }));
    throw new Error(errorData.message || 'Failed to calculate cost');
  }

  return response.json();
}
