import { Product } from '../types';
import { apiFetch, BASE_URL } from '@/lib/api-fetch';

export const getIngredients = async (
  tipoReceta: string,
  tamanoId: string,
  tipoIngrediente: string
): Promise<Product[]> => {
  const response = await apiFetch(
    `${BASE_URL}/ingredientes/search?tipoReceta=${tipoReceta}&tamanoId=${tamanoId}&tipoIngrediente=${tipoIngrediente}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch ingredients');
  }

  const data: Product[] = await response.json();

  return data;
};
