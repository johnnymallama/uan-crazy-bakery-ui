import { Tamano, TipoReceta } from '../types/tamano';
import { apiFetch, BASE_URL } from '@/lib/api-fetch';

/**
 * Fetches sizes by recipe type from the backend.
 * @param tipoReceta The type of the recipe ('TORTA' or 'CUPCAKE').
 * @returns A promise that resolves to an array of sizes.
 */
export async function getTamanosByTipoReceta(tipoReceta: TipoReceta): Promise<Tamano[]> {
  const response = await apiFetch(`${BASE_URL}/tamanos/tipo-receta/${tipoReceta}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error(`Failed to fetch sizes for recipe type ${tipoReceta}`);
    throw new Error(`Failed to fetch sizes for recipe type ${tipoReceta}`);
  }

  return response.json();
}
