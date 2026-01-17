export interface IngredienteTamanoDetalle {
  id: number;
  tamanoId: number;
  tamanoNombre: string;
  tipoIngrediente: 'BIZCOCHO' | 'RELLENO' | 'COBERTURA';
  gramos: number;
}
