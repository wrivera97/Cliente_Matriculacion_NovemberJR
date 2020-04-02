import {Asignatura} from './asignatura.model';
import { PeriodoLectivo } from './periodo-lectivo.model';
import {Docente} from './docente.model';
import { PeriodoAcademico } from './periodo-academico.model';
import { Carrera } from './carrera.model';


export class DocenteAsignatura {

    id?: number;
    docente: Docente;
    periodo_lectivo: PeriodoLectivo;
    asignatura: Asignatura;
    paralelo: String;
    jornada: String;
    periodo_academico: PeriodoAcademico;
    carrera: Carrera;
    constructor() {
        this.docente = new Docente();
        this.periodo_lectivo = new PeriodoLectivo();
        this.asignatura = new Asignatura();
        this.carrera = new Carrera();
        this.periodo_academico = new PeriodoAcademico();
        this.paralelo = '';
        this.jornada = '';

    }
}
