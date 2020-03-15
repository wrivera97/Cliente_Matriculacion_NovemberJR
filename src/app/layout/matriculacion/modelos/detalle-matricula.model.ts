import {Matricula} from './matricula.model';
import {Asignatura} from './asignatura.model';
import {TipoMatricula} from './tipo-matricula.model';


export class DetalleMatricula {
    id?: number;
    matricula: Matricula;
    asignatura: Asignatura;
    tipo_matricula: TipoMatricula;
    paralelo: string;
    jornada: string;
    jornada_asignatura: string;
    numero_matricula: string;
    estado: string;

    constructor() {
        this.matricula = new Matricula();
        this.tipo_matricula = new TipoMatricula();
        this.tipo_matricula.id = 0;
        this.asignatura = new Asignatura();
        this.asignatura.id = 0;
        this.numero_matricula = '';
        this.jornada = '';
        this.paralelo = '';
    }
}
