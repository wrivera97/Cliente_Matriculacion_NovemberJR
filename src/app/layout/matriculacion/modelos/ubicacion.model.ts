export class Ubicacion {
  id?: number;
  codigo: string;
  nombre: string;
  estado: string;
  codigo_padre: number;
  tipo: string;

  constructor() {
    this.id = 0;
    this.nombre = '';
  }
}
