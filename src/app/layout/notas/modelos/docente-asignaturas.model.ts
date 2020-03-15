import {Asignatura} from './asignatura.model';
import { PeriodoLectivo } from './periodo-lectivo.model';
import {Docente} from './docente.model';

export class DocenteAsignatura {

    id?: number;
    asignatura: Asignatura;
    docente: Docente;
    periodo: PeriodoLectivo;
    paralelo: String;
    jornada: String;


    constructor() {
        this.asignatura = new Asignatura();
        this.docente = new Docente();
        this.periodo = new PeriodoLectivo();
        this.paralelo = '';
        this.jornada = '';

    }
}
