import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ServiceService } from "../notas.service";
import { User } from "../modelos/user.model";
import { PeriodoLectivo } from "../modelos/periodo-lectivo.model";
import { Carrera } from "../modelos/carrera.model";
import { DetallenotaModel } from "../modelos/detallenota.model";
import { catalogos } from "../../../../environments/catalogos";
import { DetalleMatricula } from "../modelos/detalle-matricula.model";
import swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-nota-asistencia-estudiante",
    templateUrl: "./nota-asistencia-estudiante.component.html",
    styleUrls: ["./nota-asistencia-estudiante.component.scss"],
})
export class NotaAsistenciaEstudianteComponent implements OnInit {
    flagAll: boolean;
    messages: any;
    periodoLectivoSeleccionado: PeriodoLectivo;
    txtPeriodoActualHistorico: string;
    periodoLectivoActual: PeriodoLectivo;

    periodoLectivo: string;
    periodosLectivos: Array<PeriodoLectivo>;
    periodoLectivos: Array<PeriodoLectivo>;

    carreras: Array<Carrera>;
    carrera: Carrera;

    detalleEstudianteUser: Array<DetalleMatricula>;
    detalleEstudianteUserSelecciondo: DetalleMatricula;

    detalleNota: DetallenotaModel;

    user: User;

    constructor(
        private spinner: NgxSpinnerService,
        private router: Router,
        private NotasService: ServiceService,
        private modalService: NgbModal
    ) {}

    ngOnInit() {
        this.user = JSON.parse(localStorage.getItem("user")) as User;
        this.txtPeriodoActualHistorico = "NO EXISTE UN PERIODO ABIERTO";
        this.messages = catalogos.messages;
        this.periodoLectivo = "";
        this.detalleEstudianteUserSelecciondo = new DetalleMatricula();
        this.periodoLectivoSeleccionado = new PeriodoLectivo();
        this.periodoLectivoActual = new PeriodoLectivo();
        this.getPeriodoLectivoActual();
        this.getPeriodoLectivos();
        this.getPeriodosLectivos();
    }

    getPeriodoLectivoActual() {
        this.NotasService.get("periodo_lectivos/actual").subscribe(
            (response) => {
                if (response["periodo_lectivo_actual"] == null) {
                    this.periodoLectivoActual = new PeriodoLectivo();
                } else {
                    this.periodoLectivoActual =
                        response["periodo_lectivo_actual"];
                    this.periodoLectivoSeleccionado =
                        response["periodo_lectivo_actual"];
                    this.periodoLectivoSeleccionado.fecha_fin_cupo = new Date(
                        this.periodoLectivoActual.fecha_fin_cupo + "T00:00:00"
                    );
                    this.txtPeriodoActualHistorico = "PERIODO LECTIVO ACTUAL";
                }
            }
        );
    }

    getPeriodoLectivos() {
        this.NotasService.get("periodo_lectivos").subscribe(
            (response) => {
                this.periodoLectivos = response["periodo_lectivos"];
                this.getDetalleAsignaturaEstudianteUser(
                    this.periodoLectivoSeleccionado
                );
            },
            (error) => {}
        );
    }

    getPeriodosLectivos() {
        this.NotasService.get("periodo_lectivos/historicos").subscribe(
            (response) => {
                this.periodosLectivos =
                    response["periodos_lectivos_historicos"];
                this.periodosLectivos.forEach((value) => {
                    if (value.estado === "ACTUAL") {
                        this.periodoLectivoSeleccionado = value;
                    }
                });
            },
            (error) => {}
        );
    }

    cambiarPeriodoLectivoActual() {
        this.periodosLectivos.forEach((value) => {
            if (value.id == this.periodoLectivoActual.id) {
                this.periodoLectivoSeleccionado = value;
                if (value.estado != "ACTUAL") {
                    this.txtPeriodoActualHistorico =
                        "PERIODO LECTIVO HISTÓRICO";
                } else {
                    this.txtPeriodoActualHistorico = "PERIODO LECTIVO ACTUAL";
                }
                this.getDetalleAsignaturaEstudianteUser(
                    this.periodoLectivoSeleccionado
                );
            }
        });
    }

    getDetalleAsignaturaEstudianteUser(periodoLectivoActual) {
        this.flagAll = false;
        this.spinner.show();
        const parametros =
            "?id=" +
            this.user.id +
            "&periodo_lectivo_id=" +
            periodoLectivoActual.id;
        this.NotasService.get(
            "notaDetalle/User/Estudiante" + parametros
        ).subscribe(
            (response) => {
                this.detalleEstudianteUser = response["asignatura_estudiante"];
                this.spinner.hide();
            },
            (error) => {
                this.spinner.hide();
                swal.fire(this.messages["errorFoundAsignaturasPeriodo"]);
            }
        );
    }
    getDetalleNotaEstudiante(asignaturaId: number, content) {
        const parametros =
            "?asignatura_id=" +
            asignaturaId +
            "&periodo_lectivo_id=" +
            this.periodoLectivoActual.id +
            "&id=" +
            this.user.id;
        this.NotasService.get("notaDetalle/Estudiante" + parametros).subscribe(
            (response) => {
                this.detalleNota = response["detalleNota"];
                this.modalService.open(content);
            },
            (error) => {
            swal.fire(this.messages["errorFoundNota"]);
            }

        );
    }
}
