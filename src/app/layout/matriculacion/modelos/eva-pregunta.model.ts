import {PeriodoAcademico} from './periodo-academico.model';
import {Malla} from './malla.model';

export class EvaPregunta {
    id?: number;
    codigo: string;
    nombre: string;
    tipo: string;
    cantidad_respuestas: number;
    estado: string;

    constructor() {
        this.codigo = '';
        this.tipo = '';
    }
}
