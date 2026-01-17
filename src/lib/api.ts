
import { User } from './types/user';
import { CreateTamanoPayload, Tamano, UpdateTamanoPayload } from './types/tamano';
import { IngredienteTamano } from './types/ingrediente-tamano';
import { IngredienteTamanoDetalle } from './types/ingrediente-tamano-detalle';

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

  // The API returns the users in the correct format, so we can return them directly.
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
    // This will catch 404s and other errors, indicating the user is not in the backend DB.
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
