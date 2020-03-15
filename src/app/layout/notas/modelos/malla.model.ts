import {PeriodoAcademico} from './periodo-academico.model';
import {Carrera} from './carrera.model';

export class Malla {
  id?: number;
  nombre: string;
  fecha_aprobacion: Date;
  fecha_finalizacion: Date;
  numero_resolucion: string;
  carrera: Carrera;
  estado: string;

  constructor() {
    this.carrera = new Carrera();
  }
}
