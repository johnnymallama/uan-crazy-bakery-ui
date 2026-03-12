import { BASE_URL } from '@/lib/api-fetch';

export interface Department {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  departmentId: number;
}

export async function getDepartments(): Promise<Department[]> {
  try {
    const response = await fetch(`${BASE_URL}/geografia/departamentos`);
    if (!response.ok) {
      throw new Error('Failed to fetch departments');
    }
    const data = await response.json();
    return data.map((dep: any) => ({
      id: dep.id,
      name: dep.name,
    }));
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
}

export async function getCities(): Promise<City[]> {
  try {
    const response = await fetch(`${BASE_URL}/geografia/ciudades`);
    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }
    const data = await response.json();
    return data.map((city: any) => ({
      id: city.id,
      name: city.name,
      departmentId: city.departmentId,
    }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}
