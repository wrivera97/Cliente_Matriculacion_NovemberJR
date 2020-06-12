

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
    this.anio_graduacion = '';
    this.genero = '';
    this.fecha_nacimiento = new Date();
    this.fecha_inicio_carrera = new Date();

  }
}
