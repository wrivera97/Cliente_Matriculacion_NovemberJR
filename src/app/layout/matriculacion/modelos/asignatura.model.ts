import {PeriodoAcademico} from './periodo-academico.model';
import {Malla} from './malla.model';

export class Asignatura {
  id?: number;
  periodo_academico: PeriodoAcademico;
  malla: Malla;
  codigo: string;
  nombre: string;
  horas_practica: number;
  horas_docente: number;
  horas_autonoma: number;
  tipo: string;
  codigo_padre_prerequisito;
  codigo_padre_corequisito;
  estado: string;

  constructor() {
    this.codigo = '';
    this.horas_autonoma = 0;
    this.horas_docente = 0;
    this.horas_practica = 0;
    this.tipo = '';
    this.codigo_padre_corequisito = '';
    this.codigo_padre_prerequisito = '';
    this.malla = new Malla();
    this.periodo_academico = new PeriodoAcademico();
  }
}
