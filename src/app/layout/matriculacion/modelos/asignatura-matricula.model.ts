import {Matricula} from './matricula.model';
import {Asignatura} from './asignatura.model';
import {TipoMatricula} from './tipo-matricula.model';


export class AsignaturaMatricula {
    id?: number;
    codigo: string;
    nombre: string;
    paralelo: string;
    jornada: string;
    estado_evaluacion: string;

    constructor() {
        this.jornada = '';
        this.paralelo = '';
        this.estado_evaluacion = '';
    }
}
