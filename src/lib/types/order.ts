import { User } from './user';
import { Receta } from './receta';

// As per the class diagram
export type Estado = 'CREADO' | 'CONFIRMADO' | 'EN_PROCESO' | 'LISTO' | 'ENTREGADO' | 'CANCELADO';

export interface Nota {
  id: number;
  fechaCreacion: string;
  nota: string;
  usuarioNombre: string;
}

export interface Order {
  id: number;
  fecha: string; // Using string for date as it comes from JSON
  usuario: User;
  recetas: Receta[];
  notas: Nota[];
  estado: Estado;
  valorTotal: number;
  ganancia: number;
}
