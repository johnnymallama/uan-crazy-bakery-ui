import { apiFetch, BASE_URL } from '@/lib/api-fetch';

// --- Crear Orden ---

/**
 * Interfaz para la solicitud de creación de una orden.
 */
export interface CrearOrdenRequest {
  usuarioId: string;
  recetaIds: number[];
  notas: string[];
}

/**
 * Interfaz para la respuesta de la creación de una orden.
 * El `id` es el campo crucial para el flujo de "añadir más productos".
 */
export interface CrearOrdenResponse {
  id: number;
  // Se pueden añadir más campos de la respuesta si son necesarios.
}

/**
 * Crea una nueva orden en el backend.
 * @param data - Los datos para la creación de la orden.
 * @returns Una promesa que resuelve con la respuesta del backend, incluyendo el ID de la orden creada.
 */
export async function crearOrden(data: CrearOrdenRequest): Promise<CrearOrdenResponse> {
  const response = await apiFetch(`${BASE_URL}/orden`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Error al crear la orden:', response);
    const errorData = await response.json().catch(() => ({ message: 'No se pudo decodificar el error del servidor.' }));
    throw new Error(errorData.message || 'Ocurrió un error inesperado al crear la orden.');
  }

  return response.json();
}

// --- Agregar Receta a Orden Existente ---

/**
 * Interfaz para la solicitud de agregar una receta a una orden.
 */
export interface AgregarRecetaRequest {
    recetaId: number;
}

/**
 * Interfaz para la respuesta de agregar una receta a una orden.
 * Por ahora, la respuesta completa se devuelve como un objeto genérico.
 */
export type AgregarRecetaResponse = object;

/**
 * Agrega una receta a una orden existente en el backend.
 * @param ordenId - El ID de la orden a la que se agregará la receta.
 * @param data - Los datos de la receta a agregar.
 * @returns Una promesa que resuelve con la respuesta del backend.
 */
export async function agregarRecetaAOrden(
    ordenId: number, 
    data: AgregarRecetaRequest
): Promise<AgregarRecetaResponse> {
  const response = await apiFetch(`${BASE_URL}/orden/${ordenId}/receta`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Error al agregar la receta a la orden:', response);
    const errorData = await response.json().catch(() => ({ message: 'No se pudo decodificar el error del servidor.' }));
    throw new Error(errorData.message || 'Ocurrió un error inesperado al agregar la receta a la orden.');
  }

  return response.json();
}


// --- Consultar Órdenes por Usuario ---

/**
 * Interfaz para las notas de una orden.
 */
export interface Nota {
  id: number;
  fechaCreacion: string;
  nota: string;
  usuarioNombre: string;
}

/**
* Interfaz para cada orden retornada por la API.
*/
export type Order = {
  id: number;
  fecha: string;
  usuario: {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    tipo: string;
    telefono: string;
    direccion: string;
    departamento: string;
    ciudad: string;
    estado: boolean;
  };
  recetas: any[]; 
  notas: Nota[];
  estado: 'CREADO' | 'CONFIRMADO' | 'EN_PROCESO' | 'LISTO' | 'ENTREGADO' | 'CANCELADO';
  valorTotal: number;
  ganancia: number;
};

/**
 * Obtiene el historial de órdenes de un usuario específico.
 * @param usuarioId - El ID del usuario para el que se consultan las órdenes.
 * @returns Una promesa que resuelve con un array de órdenes.
 */
export async function getOrdersByUserId(usuarioId: string): Promise<Order[]> {

  const url = `${BASE_URL}/orden/usuario/${usuarioId}`;

  try {
    const response = await apiFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Asegura que los datos siempre sean frescos
    });

    if (!response.ok) {
      // Si la respuesta no es OK, arroja un error con el estado.
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Order[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    // En caso de error en la petición, retorna un array vacío para no bloquear la UI.
    return [];
  }
}


// --- Agregar Nota a Orden Existente ---

/**
 * Interfaz para la solicitud de agregar una nota a una orden.
 */
export interface AddNoteRequest {
  nota: string;
}

/**
 * Agrega una nota a una orden existente en el backend.
 * @param orderId - El ID de la orden a la que se agregará la nota.
 * @param data - El contenido de la nota.
 * @returns Una promesa que resuelve con la orden actualizada.
 */
export async function addNoteToOrder(
  orderId: number,
  data: AddNoteRequest
): Promise<Order> {
  const response = await apiFetch(`${BASE_URL}/orden/${orderId}/nota`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Error al agregar la nota a la orden:', response);
    const errorData = await response.json().catch(() => ({ message: 'No se pudo decodificar el error del servidor.' }));
    throw new Error(errorData.message || 'Ocurrió un error inesperado al agregar la nota.');
  }

  return response.json();
}

// --- Actualizar Estado de Orden ---

/**
 * Define los posibles estados de una orden.
 */
export type OrderStatus = 'CREADO' | 'CONFIRMADO' | 'EN_PROCESO' | 'LISTO' | 'ENTREGADO' | 'CANCELADO';


/**
 * Interfaz para la solicitud de actualización de estado de una orden.
 */
export interface UpdateStatusRequest {
  estado: OrderStatus;
}

/**
 * Actualiza el estado de una orden existente en el backend.
 * @param orderId - El ID de la orden cuyo estado se actualizará.
 * @param data - El nuevo estado para la orden.
 * @returns Una promesa que resuelve con la orden actualizada.
 */
export async function updateOrderStatus(
  orderId: number,
  data: UpdateStatusRequest
): Promise<Order> {
  const response = await apiFetch(`${BASE_URL}/orden/${orderId}/estado`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Error al actualizar el estado de la orden:', response);
    const errorData = await response.json().catch(() => ({ message: 'No se pudo decodificar el error del servidor.' }));
    throw new Error(errorData.message || 'Ocurrió un error inesperado al actualizar el estado.');
  }

  return response.json();
}
