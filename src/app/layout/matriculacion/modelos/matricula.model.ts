import {PeriodoLectivo} from './periodo-lectivo.model';
import {Estudiante} from './estudiante.model';
import {PeriodoAcademico} from './periodo-academico.model';
import {Malla} from './malla.model';
import {InformacionEstudiante} from './informacion-estudiante.model';
import {TipoMatricula} from './tipo-matricula.model';

export class Matricula {
    id?: number;
    estudiante: Estudiante;
    periodo_lectivo: PeriodoLectivo;
    periodo_academico: PeriodoAcademico;
    tipo_matricula: TipoMatricula;
    malla: Malla;
    codigo?: string;
    folio?: string;
    jornada?: string;
    jornada_operativa?: string;
    paralelo_principal?: string;
    codigo_paralelo?: string;
    fecha?: Date;
    fecha_formulario?: Date;
    fecha_solicitud?: Date;
    estado: string;

    constructor() {
        this.codigo_paralelo = '';
        this.codigo = '';
        this.paralelo_principal = '';
        this.fecha = new Date();
        this.folio = '';
        this.malla = new Malla();
        this.estudiante = new Estudiante();
        this.periodo_lectivo = new PeriodoLectivo();
        this.periodo_academico = new PeriodoAcademico();
        this.tipo_matricula = new TipoMatricula();
        this.jornada_operativa = '';
    }
}
