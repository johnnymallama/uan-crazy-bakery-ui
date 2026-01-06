
export type TipoReceta = 'TORTA' | 'CUPCAKE';

export interface Tamano {
  id: number;
  nombre: string;
  alto: number;
  diametro: number;
  porciones: number;
  estado: boolean;
  tipo_receta: TipoReceta;
}

export type CreateTamanoPayload = Omit<Tamano, 'id' | 'estado'>;

export type UpdateTamanoPayload = Partial<Omit<Tamano, 'id' | 'nombre' | 'tipo_receta' | 'estado'>>;
