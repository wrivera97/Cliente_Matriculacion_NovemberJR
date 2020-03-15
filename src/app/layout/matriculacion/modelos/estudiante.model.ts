import {Ubicacion} from './ubicacion.model';

export class Estudiante {
  id?: number;
  tipo_identificacion: string;
  identificacion: string;
  apellido1: string;
  apellido2: string;
  nombre1: string;
  nombre2: string;
  fecha_nacimiento: Date;
  fecha_inicio_carrera: Date;
  correo_personal: string;
  correo_institucional: string;
  sexo: string;
  genero: string;
  etnia: string;
  tipo_sangre: string;
  tipo_colegio: string;
  tipo_bachillerato: string;
  anio_graduacion: string;
  pueblo_nacionalidad: string;
  pais_nacionalidad: Ubicacion;
  provincia_nacimiento: Ubicacion;
  canton_nacimiento: Ubicacion;
  pais_residencia: Ubicacion;
  estado: string;

  constructor() {
    this.tipo_identificacion = '';
    this.sexo = '';
    this.etnia = '';
    this.tipo_sangre = '';
    this.tipo_bachillerato = '';
    this.tipo_colegio = '';
    this.pueblo_nacionalidad = '';
    this.tipo_bachillerato = '';
    this.tipo_colegio = '';
    this.pais_nacionalidad = new Ubicacion();
    this.provincia_nacimiento = new Ubicacion();
    this.canton_nacimiento = new Ubicacion();
    this.pais_residencia = new Ubicacion();
    this.anio_graduacion = '';
    this.genero = '';
    this.fecha_nacimiento = new Date();
    this.fecha_inicio_carrera = new Date();

  }
}
