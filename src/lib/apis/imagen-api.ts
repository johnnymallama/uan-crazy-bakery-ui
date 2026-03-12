/**
 * Este archivo contiene la lógica para interactuar con la API de generación de imágenes de pasteles.
 */

// Definimos una interfaz para los datos del pedido que necesita esta API. 
// Esto nos ayuda a asegurar que siempre enviemos la información correcta.
interface OrderDataForImage {
  recipeType: { nombre: 'TORTA' | 'CUPCAKE' } | null;
  size: { nombre: string } | null;
  sponge: { nombre: string } | null;
  filling: { nombre: string } | null;
  coverage: { nombre: string } | null;
  customization: string | null;
}

// Esta es la estructura del payload que el endpoint de backend espera recibir.
interface GenerateImagePayload {
  tipoReceta: 'TORTA' | 'CUPCAKE';
  tamano: string;
  ingredientes: {
    tipoIngrediente: 'BIZCOCHO' | 'RELLENO' | 'COBERTURA';
    ingrediente: string;
  }[];
  detalle: string;
}

// Esta es la estructura que esperamos recibir como respuesta del backend.
// Incluye la URL de la imagen y otros campos que podríamos usar para depuración.
interface GenerateImageResponse {
  prompt: string;
  imageUrl: string;
}

import { apiFetch, BASE_URL } from '@/lib/api-fetch';

// La URL base del servicio de generación de imágenes.
const API_URL = `${BASE_URL}/generate-image/custom-cake`;

/**
 * Llama al endpoint del backend para generar una imagen de pastel personalizada.
 * @param orderData - Los datos del pedido seleccionados por el usuario en el frontend.
 * @returns Una promesa que se resuelve con la respuesta del backend, incluyendo la URL de la imagen.
 */
export const generateCustomCakeImage = async (orderData: OrderDataForImage): Promise<GenerateImageResponse> => {
  // 1. Validar que tenemos todos los datos necesarios antes de llamar a la API.
  if (!orderData.recipeType || !orderData.size || !orderData.sponge || !orderData.filling || !orderData.coverage || !orderData.customization) {
    throw new Error('Faltan datos del pedido para generar la imagen.');
  }

  // 2. Mapear los datos del frontend (orderData) al payload que el backend espera (GenerateImagePayload).
  const payload: GenerateImagePayload = {
    tipoReceta: orderData.recipeType.nombre,
    tamano: orderData.size.nombre,
    ingredientes: [
      {
        tipoIngrediente: 'BIZCOCHO',
        ingrediente: orderData.sponge.nombre,
      },
      {
        tipoIngrediente: 'RELLENO',
        ingrediente: orderData.filling.nombre,
      },
      {
        tipoIngrediente: 'COBERTURA',
        ingrediente: orderData.coverage.nombre,
      },
    ],
    detalle: orderData.customization,
  };

  console.log('Enviando payload para generar imagen:', JSON.stringify(payload, null, 2));

  // 3. Realizar la petición POST al backend.
  const response = await apiFetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  // 4. Manejar la respuesta de la API.
  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Error al generar la imagen desde el backend:', response.status, errorBody);
    throw new Error('No se pudo generar la propuesta visual del pastel.');
  }

  // 5. Si todo fue bien, devolvemos la respuesta en formato JSON.
  return response.json();
};
