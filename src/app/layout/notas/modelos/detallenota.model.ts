import { DocenteAsignatura } from "./docente-asignaturas.model";
import { Estudiante } from "../modelos/estudiante.model";

export class DetallenotaModel {
    id?: number;
    nota1: string;
    nota2: string;
    nota_final: string;
    asistencia1: string;
    asistencia2: string;
    asistencia_final: string;
    estado_academico: string;
    docente_asignatura: DocenteAsignatura;
    estudiante: Estudiante;

    constructor() {
        this.nota1 = "";
        this.nota2 = "";
        this.nota_final = "";
        this.asistencia1 = "";
        this.asistencia2 = "";
        this.asistencia_final = "";
        this.estado_academico = "";
        this.docente_asignatura = new DocenteAsignatura();
        this.estudiante = new Estudiante();
    }
}
