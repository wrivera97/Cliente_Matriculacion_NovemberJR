import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ServiceService } from "../notas.service";
import { NgxSpinnerService } from "ngx-spinner";
import swal from "sweetalert2";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PeriodoAcademico } from "../modelos/periodo-academico.model";
import { PeriodoLectivo } from "../modelos/periodo-lectivo.model";
import { Carrera } from "../modelos/carrera.model";
import { DocenteAsignatura } from "../modelos/docente-asignaturas.model";
import { catalogos } from "../../../../environments/catalogos";
import { Asignatura } from "../modelos/asignatura.model";
import { Docente } from "../modelos/docente.model";
import { error } from "util";

@Component({
    selector: "app-docente-asignatura",
    templateUrl: "./docente-asignatura.component.html",
    styleUrls: ["./docente-asignatura.component.scss"],
})
export class DocenteAsignaturaComponent implements OnInit {
    periodo_academicos: Array<PeriodoAcademico>;
    periodoLectivoSeleccionado: PeriodoLectivo;
    periodo_academico: PeriodoAcademico;
    flagPagination: boolean;
    txtPeriodoActualHistorico: string;
    carreradonceteasignatura: Array<Carrera>;
    periodoLectivo: string;
    periodosLectivos: Array<PeriodoLectivo>;
    periodoLectivoActual: PeriodoLectivo;
    periodoLectivos: Array<PeriodoLectivo>;
    detalleDocenteasignaturaNuevo: DocenteAsignatura;
    detalleDocente: Array<DocenteAsignatura>;
    docenteDetalle: Array<Docente>;
    jornadas: Array<any>;
    paralelos: Array<any>;
    flagAll: boolean;
    carrera: Carrera;
    periodo_lectivo: PeriodoLectivo;
    messages: any;
    carreras: Array<Carrera>;
    actual_page: number;
    records_per_page: number;
    total_pages: number;
    total_register: number;
    total_pages_pagination: Array<any>;
    total_pages_temp: number;
    docenteAsignatura: Array<DocenteAsignatura>;
    docenteSeleccionado: Docente;
    detalleDocenteSeleccionado: DocenteAsignatura;
    asignaturas: Array<Asignatura>;
    constructor(
        private spinner: NgxSpinnerService,
        private NotasService: ServiceService,
        private router: Router,
        private modalService: NgbModal
    ) {}

    ngOnInit() {
        this.txtPeriodoActualHistorico = "NO EXISTE UN PERIODO ABIERTO";
        this.flagAll = false;

        this.periodoLectivo = "";

        this.actual_page = 1;
        this.flagPagination = true;
        this.messages = catalogos.messages;
        this.total_pages_pagination = new Array<any>();
        this.total_pages_temp = 10;
        this.records_per_page = 5;
        this.actual_page = 1;
        this.total_pages = 1;

        this.periodoLectivoSeleccionado = new PeriodoLectivo();
        this.docenteSeleccionado = new Docente();
        this.paralelos = catalogos.paralelos;
        this.jornadas = catalogos.jornadas;
        this.periodoLectivoActual = new PeriodoLectivo();
        this.carrera = new Carrera();
        this.periodo_academico = new PeriodoAcademico();
        this.periodo_lectivo = new PeriodoLectivo();
        this.detalleDocenteasignaturaNuevo = new DocenteAsignatura();
        this.detalleDocenteSeleccionado = new DocenteAsignatura();
        this.getDocentesAsignados();
        this.getCarreras();
        this.getPeriodoAcademicos();
        this.getPeriodoLectivoActual();
        this.getPeriodoLectivos();
        this.getPeriodosLectivos();
    }

    getPeriodoAcademicos() {
        this.NotasService.get("catalogos/periodo_academicos").subscribe(
            (response) => {
                this.periodo_academicos = response["periodo_academicos"];
            },
            (error) => {
                this.spinner.hide();
            }
        );
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
            },
            (error) => {
                this.spinner.hide();
            }
        );
    }

    getPeriodoLectivos() {
        this.NotasService.get("periodo_lectivos").subscribe(
            (response) => {
                this.periodoLectivos = response["periodo_lectivos"];
            },
            (error) => {
                this.spinner.hide();
            }
        );
    }

    getPeriodosLectivos() {
        this.spinner.show();
        this.NotasService.get("periodo_lectivos/historicos").subscribe(
            (response) => {
                this.periodosLectivos =
                    response["periodos_lectivos_historicos"];
                this.spinner.hide();
            },
            (error) => {
                this.spinner.hide();
            }
        );
    }
    cambiarPeriodoLectivoActual() {
        this.periodosLectivos.forEach((value) => {
            // tslint:disable-next-line:triple-equals
            if (value.id == this.periodoLectivoActual.id) {
                this.periodoLectivoSeleccionado = value;
                // tslint:disable-next-line:triple-equals
                if (value.estado != "ACTUAL") {
                    this.txtPeriodoActualHistorico =
                        "PERIODO LECTIVO HISTÓRICO";
                } else {
                    this.txtPeriodoActualHistorico = "PERIODO LECTIVO ACTUAL";
                }
            }
        });
    }
    getDocentesAsignados() {
        // funcion o metodo { abrimos
        this.flagAll = false; // paginacion en caso de mostrar en otra pagina
        this.spinner.show(); // muestra animacion de cargar
        this.NotasService.get("detalleDocentes").subscribe(
            // nos subscribimos
            (Response) => {
                this.docenteDetalle = Response["detalleDocentes"]; // llamamos desde el response para obtener datos
                // console.log(Response)//muestra datos en consola
                this.spinner.hide(); // ocultamos la animacion de carga
            },
            (error) => {
                // sintaxis de error en caso de existir alguno
                this.spinner.hide(); // ocultamos animacion
            }
        ); // cierre del subcribe y response
    } // funcion o metodo }cerramos
    /*metodo get(obtenemos las asignaturas que estan asignadas al docente que fue seleccionado)*/
    getDetalleDocente(docente: Docente) {/*creamos nuestro metodo con una breve descripción */
        this.spinner.show();
        this.detalleDocente = null;
        this.flagAll = true;
        this.docenteSeleccionado = docente;
        this.NotasService.get(/*LLamamos a nuesto servicio con metodo get seguidamente con la direccion de la api con sus parametros*/
            "asignacionDocentes?id=" +
                this.docenteSeleccionado.id +/*primer parametro */
                "&periodo_lectivo_id=" +
                this.periodoLectivoActual.id/*segundo parametro* */
        ).subscribe(/*nos subscribimos */
            (Response) => { /*obtenemos la respuesta desde el servidor*/
                this.detalleDocente = Response["asignacionesDocente"];/*la respuesta la almacenamos en un array*/
                this.spinner.hide();
            },
            (error) => {
                this.spinner.hide();
                swal.fire(this.messages["error500"]); /*si existe un error o no existe respuesta enviamos un mensaje de error*/
            }
        );
    }
    /*metodo post (enviamos los datos a guardar al backend  "laravel") */
    createDetalleDocenteAsignatura() {/*creamos nuestro metodo con una breve descripción */
        this.spinner.show();
        this.detalleDocenteasignaturaNuevo.estado = "ACTIVO"; /*Enviamos como estado "ACTIVO" al crear un nuevo detalle*/
        this.NotasService.post("asignacionDocentes", { /*llamamos a nuestro servicio con metodo post seguidamente con la direccion de la api*/
            docente_asignatura: this.detalleDocenteasignaturaNuevo,
        }).subscribe(/*nos subscribimos*/
            (response) => { /*obtenemos la respuesta */
                this.getDetalleDocente(this.docenteSeleccionado);
                this.detalleDocenteasignaturaNuevo = new DocenteAsignatura();/*llamamos al modelo y pasamos los datos declarados en el modelo*/
                this.spinner.hide();
                swal.fire(this.messages["createSuccess"]);/*si los datos fueron guardados mostramos un mensaje o notificacion*/
            },
            (error) => {
                this.spinner.hide();
                if (error.error.errorInfo === "23505") {
                    swal.fire(this.messages["error23505"]);
                } else {
                    swal.fire(this.messages["error500"]);/*si hubo un error enviamos un mensaje describiendo el error*/
                }
                this.detalleDocenteasignaturaNuevo = new DocenteAsignatura();
            }
        );
    }
    /*metodo put (enviamos los datos a actualizar al backend "laravel) */
    updateDetalleDocenteAsignatura(detalledocente: DocenteAsignatura) {/*creamos nuestro metodo con una breve descripción con una variable local*/
        this.spinner.show();
        this.NotasService.update("asignacionDocentes", {/*llamamos nuestro servicio con metodo update seguidamente con la direccion de la api*/
            docente_asignatura: detalledocente,
        }).subscribe( /*nos subscribimos */
            (response) => { /*obtenemos la respuesta*/
                this.spinner.hide();
                swal.fire(this.messages["updateSuccess"]);/*si los datos fueron actualizados mostramos un mensaje o notificacion*/
                this.getDetalleDocente(this.docenteSeleccionado);
            },
            (error) => {
                this.spinner.hide();
                swal.fire(this.messages["error500"]);/*si hubo un error al actualizar enviamos un mensaje de error*/
            }
        );
    }
    /*meotodo delete (enviamos el id del registro selecccionado al backend "laravel")*/
    async deleteAsignaturaDocente(detalledocente: DocenteAsignatura) {/*creamos nuestro metodo con una breve descripción con una variable local*/
        const { value: razonEliminarAsignatura } = await swal.fire( /*creamos una constante para almacenar la razon por la cual se eliminara el registro */
            this.messages["deleteInputAccept"]/*mostramos un mensaje advirtiendo si desea o no eliminar el registro */
        );
        if (razonEliminarAsignatura) {
            swal.fire(this.messages["deleteInputAccept"]).then((result) => {
                if (result.value) {
                    this.spinner.show();
                    this.NotasService.delete(/*llamamos a nuestro servicio con metodo delete seguido de nuestra ruta o api*/
                        "asignacionDocentes?id=" + detalledocente.id /*seleccionamos y enviamos el id del registro*/
                    ).subscribe(
                        (response) => {/*obtenemos la respuesta desde el servidor */
                            this.getDetalleDocente(this.docenteSeleccionado);
                            this.spinner.show();
                            swal.fire(this.messages["deleteSuccess"]);/*mensaje de eliminado correcto */
                        },
                        (error) => {
                            this.spinner.hide();
                            swal.fire(this.messages["error500"]);/*mensaje de que hubo un error o el registro no existe (404 - 500) */
                        }
                    );
                }
            });
        }
     }

    opendetalledocenteasignaturas(content) {
        this.detalleDocenteasignaturaNuevo.docente.id = this.docenteSeleccionado.id;
        this.detalleDocenteasignaturaNuevo.periodo_lectivo.id = this.periodoLectivoActual.id;
        this.modalService.open(content).result.then(
            (resultModal) => {
                if (resultModal === "save") {
                    this.createDetalleDocenteAsignatura();
                }
            },
            (resultCancel) => {}
        );
    }

    async opendetalledocenteasignaturasUpdate(content) {
        const { value: razonUpdateAsignatura } = await swal.fire(
            this.messages["UpdateQuestionAccept"]
        );
        if (razonUpdateAsignatura) {
            this.modalService.open(content).result.then(
                (resultModal) => {
                    if (resultModal === "save") {
                        this.updateDetalleDocenteAsignatura(
                            razonUpdateAsignatura
                        );
                    }
                },
                (resultCancel) => {}
            );
        } else {
            if (!(razonUpdateAsignatura === undefined)) {
                swal.fire(
                    "Motivo",
                    "Debe contener por lo menos un motivo",
                    "warning"
                );
            }
        }
    }
    getCarreras() {
        this.spinner.show();
        this.NotasService.get("carreras").subscribe(
            (Response) => {
                this.carreras = Response["carreras"];
                this.spinner.hide();
            },
            (error) => {
                this.spinner.hide();
            }
        );
    }
    getAsignaturasCarrera() {
        this.NotasService.get(
            "matriculas/asignaturas?carrera_id=" + this.carrera.id
        ).subscribe(
            (response) => {
                this.spinner.hide();
                this.asignaturas = response["asignaturas"];
            },
            (error) => {
                this.spinner.hide();
                swal.fire(this.messages["error412"]);
            }
        );
    }
}
