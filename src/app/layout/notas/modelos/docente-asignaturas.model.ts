import {Asignatura} from './asignatura.model';
import { PeriodoLectivo } from './periodo-lectivo.model';
import {Docente} from './docente.model';



export class DocenteAsignatura {
    id?: number;
    docente: Docente;
    periodo_lectivo: PeriodoLectivo;
    asignatura: Asignatura;
    paralelo: String;
    jornada: String;
    estado: String;
    constructor() {
        this.docente = new Docente();
        this.periodo_lectivo = new PeriodoLectivo();
        this.asignatura = new Asignatura();
        this.paralelo = '';
        this.jornada = '';
        this.jornada = '';

    }
}
