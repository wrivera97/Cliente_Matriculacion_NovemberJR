import {Instituto} from './instituto.model';

export class Carrera {
    id?: number;
    instituto: Instituto;
    codigo: string;
    numero_resolucion: string;
    codigo_sniese: string;
    nombre: string;
    modalidad: string;
    titulo_otorga: string;
    siglas: string;
    tipo_carrera: string;
    descripcion: string;
    estado: string;

    seleccionada: boolean;

    constructor() {
        this.id = 0;
        this.instituto = new Instituto();
        this.codigo = '';
        this.codigo_sniese = '';
        this.nombre = '';
        this.modalidad = '';
        this.titulo_otorga = '';
        this.siglas = '';
        this.tipo_carrera = '';
        this.descripcion = '';
        this.estado = '';
        this.seleccionada = false;
    }
}
