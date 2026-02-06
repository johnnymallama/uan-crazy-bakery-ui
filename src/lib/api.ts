import { User } from './types/user';
import { CreateTamanoPayload, Tamano, UpdateTamanoPayload } from './types/tamano';
import { IngredienteTamano } from './types/ingrediente-tamano';
import { IngredienteTamanoDetalle } from './types/ingrediente-tamano-detalle';
import { Product } from './types/product';
import { ProductType } from './types/product-type';
import { Order, Estado } from './types/order';

const BASE_URL = 'https://crazy-bakery-bk-835393530868.us-central1.run.app';

/**
 * Fetches all users from the backend.
 * @returns A promise that resolves to an array of users.
 */
export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/usuarios`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch users');
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

/**
 * Registers a new user in the backend database.
 * @param userData - The user's data for registration.
 * @returns The response from the server.
 */
export async function createUser(userData: any) {
  const response = await fetch(`${BASE_URL}/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred during registration.');
  }

  return response.json();
}

/**
 * Fetches user data from the backend by their Firebase UID.
 * @param uid The user's Firebase UID.
 * @returns The user's data from the backend.
 */
export async function getUserById(uid: string) {
  const response = await fetch(`${BASE_URL}/usuarios/${uid}`);

  if (!response.ok) {
    throw new Error('User not found in database.');
  }

  return response.json();
}

/**
 * Deletes a user from the backend database.
 * @param userId - The ID of the user to delete.
 * @returns The response from the server.
 */
export async function deleteUser(userId: string) {
  const response = await fetch(`${BASE_URL}/usuarios/${userId}`,
  {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }

  return response.json();
}

/**
 * Updates a user in the backend database.
 * @param userId - The ID of the user to update.
 * @param userData - The user's data to update.
 * @returns The response from the server.
 */
export async function updateUser(userId: string, userData: Partial<User>) {
  const response = await fetch(`${BASE_URL}/usuarios/${userId}`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  return response.json();
}

/**
 * Creates a new tamano in the backend database.
 * @param tamanoData - The tamano's data for creation.
 * @returns The response from the server.
 */
export async function createTamano(tamanoData: CreateTamanoPayload): Promise<Tamano> {
  const response = await fetch(`${BASE_URL}/tamanos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tamanoData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred during tamano creation.');
  }

  return response.json();
}

/**
 * Fetches all tamanos from the backend.
 * @returns A promise that resolves to an array of tamanos.
 */
export async function getTamanos(): Promise<Tamano[]> {
  const response = await fetch(`${BASE_URL}/tamanos`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch tamanos');
    throw new Error('Failed to fetch tamanos');
  }

  return response.json();
}

/**
 * Fetches tamano data from the backend by its ID.
 * @param id The tamano's ID.
 * @returns The tamano's data from the backend.
 */
export async function getTamanoById(id: number): Promise<Tamano> {
  const response = await fetch(`${BASE_URL}/tamanos/${id}`);

  if (!response.ok) {
    throw new Error('Tamano not found in database.');
  }

  return response.json();
}

/**
 * Updates a tamano in the backend database.
 * @param id - The ID of the tamano to update.
 * @param tamanoData - The tamano's data to update.
 * @returns The response from the server.
 */
export async function updateTamano(id: number, tamanoData: UpdateTamanoPayload): Promise<Tamano> {
  const response = await fetch(`${BASE_URL}/tamanos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tamanoData),
  });

  if (!response.ok) {
    throw new Error('Failed to update tamano');
  }

  return response.json();
}

/**
 * Deletes a tamano from the backend database.
 * @param id - The ID of the tamano to delete.
 * @returns The response from the server.
 */
export async function deleteTamano(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/tamanos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete tamano');
  }
}

/**
 * Adds a new ingredient grammage to a size.
 * @param data - The ingredient-size data.
 * @returns The response from the server.
 */
export const addIngredienteTamano = async (data: IngredienteTamano): Promise<any> => {
  const response = await fetch(`${BASE_URL}/ingrediente-tamano`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al añadir el gramaje');
  }

  return response.json();
};

/**
 * Fetches all ingredient grammages for a given size.
 * @param tamanoId - The ID of the size.
 * @returns A promise that resolves to an array of ingredient grammages.
 */
export async function getIngredientesPorTamano(tamanoId: number): Promise<IngredienteTamanoDetalle[]> {
  const response = await fetch(`${BASE_URL}/ingrediente-tamano/${tamanoId}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error(`Failed to fetch grammages for size ${tamanoId}`);
    throw new Error(`Failed to fetch grammages for size ${tamanoId}`);
  }

  return response.json();
}

/**
 * Deletes an ingredient grammage from the backend database.
 * @param id - The ID of the ingredient grammage to delete.
 * @returns The response from the server.
 */
export async function deleteIngredienteTamano(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/ingrediente-tamano/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete ingredient grammage');
  }
}

/**
 * Creates a new product in the backend database.
 * @param productData - The product's data for creation.
 * @returns The response from the server.
 */
export async function createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  const response = await fetch(`${BASE_URL}/ingredientes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred during product creation.');
  }

  return response.json();
}

/**
 * Fetches all products from the backend.
 * @returns A promise that resolves to an array of products.
 */
export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/ingredientes`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch products');
    throw new Error('Failed to fetch products');
  }

  return response.json();
}

/**
 * Fetches all product types from the backend.
 * @returns A promise that resolves to an array of product types.
 */
export async function getProductTypes(): Promise<ProductType[]> {
  const response = await fetch(`${BASE_URL}/tipo-ingredientes`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch product types');
    throw new Error('Failed to fetch product types');
  }

  return response.json();
}

/**
 * Fetches product data from the backend by its ID.
 * @param id The product's ID.
 * @returns The product's data from the backend.
 */
export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`${BASE_URL}/ingredientes/${id}`);

  if (!response.ok) {
    throw new Error('Product not found in database.');
  }

  return response.json();
}

/**
 * Updates a product in the backend database.
 * @param id - The ID of the product to update.
 * @param productData - The product's data to update.
 * @returns The response from the server.
 */
export async function updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
  const response = await fetch(`${BASE_URL}/ingredientes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error('Failed to update product');
  }

  return response.json();
}

/**
 * Deletes a product from the backend database.
 * @param id - The ID of the product to delete.
 * @returns The response from the server.
 */
export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/ingredientes/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
}

/**
 * Fetches products by type from the backend.
 * @param type The type of the products to fetch.
 * @returns A promise that resolves to an array of products.
 */
export async function getProductsByType(type: string): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/ingredientes/tipo/${type}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error(`Failed to fetch products for type ${type}`);
    throw new Error(`Failed to fetch products for type ${type}`);
  }

  return response.json();
}

/**
 * Fetches orders from the backend. Can be filtered by status.
 * @param status - The status to filter orders by. If 'ALL' or undefined, fetches all orders.
 * @returns A promise that resolves to an array of orders.
 */
export async function getOrders(status?: Estado | 'ALL'): Promise<Order[]> {
  let url = `${BASE_URL}/orden`;
  if (status && status !== 'ALL') {
    url = `${BASE_URL}/orden/estado/${status}`;
  }

  const response = await fetch(url, {
    cache: 'no-store',
  });

  if (!response.ok) {
    if (status === 'EN_PREPARACION' || response.status === 404) {
      return [];
    }
    console.error(`Failed to fetch orders with status: ${status}`);
    throw new Error(`Failed to fetch orders with status: ${status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data;
}

/**
 * Updates the status of an order in the backend.
 * @param orderId - The ID of the order to update.
 * @param newStatus - The new status for the order.
 * @param notes - Optional notes for the status update.
 * @returns The response from the server.
 */
export async function updateOrderStatus(orderId: number, newStatus: Estado, notes?: string): Promise<Order> {
  const body: { estado: Estado; nota?: string } = { estado: newStatus };
  if (notes) {
    body.nota = notes;
  }

  const response = await fetch(`${BASE_URL}/orden/${orderId}/estado`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorDetails = response.statusText;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorDetails = errorData.message;
      }
    } catch (e) {
      // Ignore if the error response is not JSON
    }
    throw new Error(`Error updating order status: ${errorDetails} (Status: ${response.status})`);
  }

  return response.json();
}
