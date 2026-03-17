import { apiFetch, BASE_URL } from '@/lib/api-fetch';

// --- Interfaces ---

/**
 * Respuesta del backend al generar un reporte.
 */
export interface ReporteResponse {
  nombre_reporte: string;
  fecha_reporte: string;
  url: string;
}

// --- Funciones ---

/**
 * Genera el reporte de estrategia de ingredientes.
 * @returns Una promesa que resuelve con los metadatos del reporte generado, incluyendo la URL del PDF.
 */
export async function generarReporteEstrategiaIngredientes(): Promise<ReporteResponse> {
  const response = await apiFetch(`${BASE_URL}/generate-reports/ingredient-strategy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Error al generar el reporte de estrategia de ingredientes:', response);
    const errorData = await response.json().catch(() => ({ message: 'No se pudo decodificar el error del servidor.' }));
    throw new Error(errorData.message || 'Ocurrió un error inesperado al generar el reporte.');
  }

  return response.json();
}

/**
 * Genera el reporte de análisis de ingredientes.
 * @returns Una promesa que resuelve con los metadatos del reporte generado, incluyendo la URL del PDF.
 */
export async function generarReporteAnalisisIngredientes(): Promise<ReporteResponse> {
  const response = await apiFetch(`${BASE_URL}/generate-reports/ingredient-analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Error al generar el reporte de análisis de ingredientes:', response);
    const errorData = await response.json().catch(() => ({ message: 'No se pudo decodificar el error del servidor.' }));
    throw new Error(errorData.message || 'Ocurrió un error inesperado al generar el reporte.');
  }

  return response.json();
}
