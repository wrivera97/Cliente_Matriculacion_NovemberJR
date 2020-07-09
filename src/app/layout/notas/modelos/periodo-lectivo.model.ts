export class PeriodoLectivo {
    id?: number;
    codigo?: string;
    nombre?: string;
    fecha_fin_cupo?: Date;
    fecha_fin_anulacion?: Date;
    estado: string;

    constructor() {
        this.id = 0;
        this.codigo = "";
        this.nombre = "";
        this.fecha_fin_cupo = new Date();
        this.fecha_fin_anulacion = new Date();
    }
}
