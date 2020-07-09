import { Matricula } from "./matricula.model";
import { Asignatura } from "./asignatura.model";

export class DetalleMatricula {
    id?: number;
    matricula: Matricula;
    asignatura: Asignatura;
    paralelo: string;
    jornada: string;
    jornada_asignatura: string;
    numero_matricula: string;
    estado: string;

    constructor() {
        this.matricula = new Matricula();
        this.asignatura = new Asignatura();
        this.asignatura.id = 0;
        this.numero_matricula = "";
        this.jornada = "";
        this.paralelo = "";
    }
}
