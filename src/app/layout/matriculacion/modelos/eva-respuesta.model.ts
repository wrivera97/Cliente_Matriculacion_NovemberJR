import {PeriodoAcademico} from './periodo-academico.model';
import {Malla} from './malla.model';
import {EvaPregunta} from './eva-pregunta.model';
import {Estudiante} from './estudiante.model';

export class EvaRespuesta {
    id?: number;
    codigo: string;
    nombre: string;
    tipo: string;
    cantidad_respuestas: number;
    eva_pregunta: EvaPregunta;
    valor: number;
    estado: string;
    estudiante: Estudiante;

    constructor() {
        this.eva_pregunta = new EvaPregunta();
        this.estudiante = new Estudiante();
        this.codigo = '';
        this.tipo = '';
    }
}
