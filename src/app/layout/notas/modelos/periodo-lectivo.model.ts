export class PeriodoLectivo {
    id?: number;
    codigo?: string;
    nombre?: string;
    fecha_inicio_periodo?: Date;
    fecha_fin_periodo?: Date;
    fecha_inicio_cupo?: Date;
    fecha_fin_cupo?: Date;
    fecha_inicio_ordinaria?: Date;
    fecha_fin_ordinaria?: Date;
    fecha_inicio_extraordinaria?: Date;
    fecha_fin_extraordinaria?: Date;
    fecha_inicio_especial?: Date;
    fecha_fin_especial?: Date;
    fecha_fin_anulacion?: Date;
    estado: string;

    constructor() {
        this.id = 0;
        this.codigo = '';
        this.fecha_fin_cupo = new Date();
        this.fecha_fin_anulacion = new Date();
    }
}
