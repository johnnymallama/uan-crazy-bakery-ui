'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Department, City, getDepartments, getCities } from '@/lib/colombia-api';

interface LocationContextType {
  departments: Department[];
  cities: City[];
  loading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [departmentsData, citiesData] = await Promise.all([
          getDepartments(),
          getCities(),
        ]);
        setDepartments(departmentsData);
        setCities(citiesData);
      } catch (error) {
        console.error('Error loading location data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <LocationContext.Provider value={{ departments, cities, loading }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
