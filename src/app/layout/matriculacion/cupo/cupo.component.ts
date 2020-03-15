import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ServiceService} from '../service.service';
import {Matricula} from '../modelos/matricula.model';
import {Carrera} from '../modelos/carrera.model';
import {PeriodoAcademico} from '../modelos/periodo-academico.model';
import {catalogos} from '../../../../environments/catalogos';
import {Router} from '@angular/router';
import {Estudiante} from '../modelos/estudiante.model';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {DetalleMatricula} from '../modelos/detalle-matricula.model';
import {Asignatura} from '../modelos/asignatura.model';
import {TipoMatricula} from '../modelos/tipo-matricula.model';
import {PeriodoLectivo} from '../modelos/periodo-lectivo.model';
import swal from 'sweetalert2';
import {environment} from '../../../../environments/environment';
import {Notificacion} from '../modelos/notificacion.model';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner';
import {User} from '../modelos/user.model';


@Component({
    selector: 'app-cupo',
    templateUrl: './cupo.component.html',
    styleUrls: ['./cupo.component.scss']
})

export class CupoComponent implements OnInit {
    generos: Array<any>;
    sexos: Array<any>;
    etnias: Array<any>;
    tiposSangre: Array<any>;
    flagCuposEstado: boolean;
    jornadasOperativa: any;
    estados: any;
    estadoCupos: string;
    estudianteSeleccionado: Estudiante;
    urlExportMatrizSniese: string;
    fechaActual: Date;
    txtPeridoActualHistorico: string;
    periodoLectivoSeleccionado: PeriodoLectivo;
    periodoLectivos: Array<PeriodoLectivo>;
    notificacion: Notificacion;
    erroresCargaCupos: Array<any>;
    urlExportCuposPeriodoAcademico: string;
    urlExportCuposCarrera: string;
    urlExportListasPeriodoAcademico: string;
    buscador: string;
    archivo: any;
    archivoTemp: any;
    flagAsignaturasCupo: boolean;
    cupos: Array<Matricula>;
    detalleMatricula: Array<DetalleMatricula>;
    detalleMatriculaNuevo: DetalleMatricula;
    estudiantes: Array<Estudiante>;
    asignaturas: Array<Asignatura>;
    tiposMatricula: Array<TipoMatricula>;
    jornadas: Array<any>;
    paralelos: Array<any>;
    numerosMatricula: Array<any>;
    actual_page: number;
    records_per_page: number;
    total_pages: number;
    total_register: number;
    total_pages_pagination: Array<any>;
    total_pages_temp: number;
    total_detalle_matriculas_anulados: number;
    total_detalle_matriculas_en_proceso: number;
    total_detalle_matriculas_matriculados: number;
    total_detalle_matriculas_aprobados: number;
    total_detalle_matriculas_desertores: number;

    flagPagination: boolean;
    messages: any;
    matriculaSeleccionada: Matricula;
    carrera: Carrera;
    periodoAcademico: string;
    periodoLectivo: string;
    periodoLectivoActual: PeriodoLectivo;
    periodosLectivos: Array<PeriodoLectivo>;
    matriculados: Array<any>;
    matriculas: Array<Matricula>;
    carreras: Array<Carrera>;
    peridoAcademicos: Array<PeriodoAcademico>;
    rutaActual: string;
    user: User;
    carrerasTemp: any;

    constructor(private spinner: NgxSpinnerService, private service: ServiceService, private router: Router,
                private modalService: NgbModal) {

    }

    ngOnInit() {
        this.generos = catalogos.generos;
        this.sexos = catalogos.sexos;
        this.etnias = catalogos.etnias;
        this.tiposSangre = catalogos.tiposSangre;
        this.estados = catalogos.estados;
        this.estudianteSeleccionado = new Estudiante();
        this.fechaActual = new Date();
        this.periodoLectivoSeleccionado = new PeriodoLectivo();
        this.txtPeridoActualHistorico = 'NO EXISTE UN PERIODO ABIERTO';
        this.user = JSON.parse(localStorage.getItem('user')) as User;
        this.buscador = '';
        this.notificacion = new Notificacion();
        this.erroresCargaCupos = new Array<any>();
        this.flagPagination = true;
        this.total_pages_pagination = new Array<any>();
        this.total_pages_temp = 10;
        this.records_per_page = 5;
        this.actual_page = 1;
        this.total_pages = 1;
        this.paralelos = catalogos.paralelos;
        this.jornadas = catalogos.jornadas;
        this.jornadasOperativa = catalogos.jornadasOperativa;
        this.numerosMatricula = catalogos.numerosMatricula;
        this.flagAsignaturasCupo = false;
        this.rutaActual = this.router.url;
        this.matriculaSeleccionada = new Matricula();
        this.periodoLectivoActual = new PeriodoLectivo();
        this.matriculas = new Array<Matricula>();
        this.detalleMatriculaNuevo = new DetalleMatricula();
        this.carrera = new Carrera();
        this.periodoAcademico = '';
        this.periodoLectivo = '';
        this.messages = catalogos.messages;
        this.getPeriodoLectivoActual();
        this.getPeriodoLectivos();
        this.getPeriodosLectivos();
        this.getCarreras();
        this.getPeriodoAcademicos();
        this.getPeriodoLectivoActual();
        this.getPeriodoLectivos();
        this.getTiposMatricula();
    }

    createDetalleMatricula(razonNuevaAsignatura: string) {
        this.spinner.show();
        this.detalleMatriculaNuevo.estado = 'EN_PROCESO';
        this.service.post('detalle_matriculas', {'detalle_matricula': this.detalleMatriculaNuevo}).subscribe(
            response => {
                this.getDetalleMatricula(this.matriculaSeleccionada);
                this.sendEmailNotificacion('detalle_cupos', 'Nueva Asignatura', razonNuevaAsignatura);
                this.spinner.hide();
                swal.fire(this.messages['createSuccess']);
                this.detalleMatriculaNuevo = new DetalleMatricula();
            },
            error => {
                this.spinner.hide();
                if (error.error.errorInfo[0] === '23505') {
                    swal.fire(this.messages['error23505']);
                } else {
                    swal.fire(this.messages['error500']);
                }
            });
    }

    cambiarEstadoFlagAsignaturasCupo() {
        this.flagAsignaturasCupo = false;
        if (this.buscador.trim() === '') {
            if (this.flagCuposEstado) {
                this.getCuposPorEstado(this.actual_page, this.estadoCupos);
            } else {
                this.getCupos(this.actual_page);
            }
        } else {
            this.getCupo();
        }
    }

    crearNumerosPaginacion() {
        console.log(this.total_pages_temp);
        if (this.total_pages > 10) {
            for (let i = 0; i < 10; i++) {
                if (this.total_pages_temp >= 10) {
                    this.total_pages_pagination[i] = i + this.total_pages_temp - 9;
                }
            }
        } else {
            this.total_pages_pagination = new Array<any>();
            for (let i = 0; i < this.total_pages; i++) {
                this.total_pages_pagination[i] = i + 1;
            }
        }
    }

    async deleteDetalleCupo(detalleMatricula: DetalleMatricula) {
        const {value: razonAnularAsignatura} = await swal.fire(this.messages['deleteInputQuestion']);
        if (razonAnularAsignatura) {
            swal.fire(this.messages['deleteQuestion'])
                .then((result) => {
                    if (result.value) {
                        this.spinner.show();
                        this.service.delete('matriculas/delete_detalle_cupo?id=' + detalleMatricula.id).subscribe(
                            response => {
                                this.getDetalleMatricula(this.matriculaSeleccionada);
                                this.spinner.hide();
                                swal.fire(this.messages['deleteSuccess']);
                                // this.sendEmailNotificacion('detalle_cupos', 'Eliminar Asignatura', razonAnularAsignatura);
                            },
                            error => {
                                this.spinner.hide();
                                swal.fire(this.messages['error500']);
                                this.getDetalleMatricula(this.matriculaSeleccionada);
                            });
                    }
                });
        } else {
            if (!(razonAnularAsignatura === undefined)) {
                swal.fire('Motivo', 'Debe contener por lo menos un motivo', 'warning');
            }
        }
    }

    async deleteCupo(matricula: Matricula) {
        const {value: razonEliminarCupo} = await swal.fire(this.messages['deleteInputQuestion']);
        if (razonEliminarCupo) {
            swal.fire(this.messages['deleteQuestion'])
                .then((result) => {
                    if (result.value) {
                        this.spinner.show();
                        this.service.delete('matriculas/cupo?id=' + matricula.id).subscribe(
                            response => {
                                this.getCupos(this.actual_page);
                                // this.sendEmailNotificacion('cupos', 'Eliminar Cupo', razonEliminarCupo);
                                this.spinner.hide();
                                swal.fire(this.messages['deleteSuccess']);

                            },
                            error => {
                                this.spinner.hide();
                                swal.fire(this.messages['error500']);
                                this.getCupos(this.actual_page);
                            });
                    }
                });
        } else {
            if (!(razonEliminarCupo === undefined)) {
                swal.fire('Motivo', 'Debe contener por lo menos un motivo', 'warning');
            }
        }
    }

    getAsignaturasCarrera() {
        this.service.get('matriculas/asignaturas?carrera_id=' + this.carrera.id).subscribe(
            response => {
                this.asignaturas = response['asignaturas'];
            },
            error => {
                this.spinner.hide();
                swal.fire(this.messages['error500']);
            });
    }

    getCarreras() {
        this.spinner.show();
        this.service.get('catalogos/carreras?user_id=' + this.user.id).subscribe(
            response => {
                this.carreras = response['carreras'];
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
            });
    }

    filter(event) {
        if (event.which === 1 || event.which === 13 || this.buscador.length === 0) {
            if (this.buscador.length === 0) {
                this.flagPagination = true;
                this.getCupos(1);
            } else {
                this.flagPagination = false;
                this.getCupo();
            }
        }
    }

    getCupo() {
        this.flagCuposEstado = false;
        this.total_pages = 1;
        this.crearNumerosPaginacion();
        this.buscador = this.buscador.toUpperCase();
        const parametros =
            '?identificacion=' + this.buscador
            + '&apellido1=' + this.buscador
            + '&apellido2=' + this.buscador
            + '&nombre1=' + this.buscador
            + '&nombre2=' + this.buscador
            + '&periodo_lectivo_id=' + this.periodoLectivoActual.id
            + '&carrera_id=' + this.carrera.id;
        this.spinner.show();
        this.service.get('matriculas/cupo' + parametros).subscribe(
            response => {
                this.cupos = response['cupo'];
                this.spinner.hide();
                this.total_register = this.cupos.length;
            },
            error => {
                this.spinner.hide();
                swal.fire(this.messages['error500']);
            });
    }

    getCupos(page: number) {
        this.flagCuposEstado = false;
        this.flagPagination = true;
        this.buscador = '';
        this.spinner.show();
        this.getDetalleMatriculasForMalla();
        this.urlExportListasPeriodoAcademico = environment.API_URL + 'exports/listas/periodo?carrera_id=' + this.carrera.id
            + '&periodo_academico_id=' + this.periodoAcademico + '&periodo_lectivo_id=' + this.periodoLectivoSeleccionado.id;
        this.urlExportCuposPeriodoAcademico = environment.API_URL + 'exports/cupos_periodo_academico?carrera_id=' + this.carrera.id
            + '&periodo_academico_id=' + this.periodoAcademico + '&periodo_lectivo_id=' + this.periodoLectivoSeleccionado.id;
        this.urlExportCuposCarrera = environment.API_URL + 'exports/cupos_carrera?carrera_id=' + this.carrera.id
            + '&periodo_lectivo_id=' + this.periodoLectivoSeleccionado.id;
        this.urlExportMatrizSniese = environment.API_URL + 'exports/matriz_sniese?carrera_id=' + this.carrera.id
            + '&periodo_lectivo_id=' + this.periodoLectivoSeleccionado.id;
        this.actual_page = page;
        const parametros = '?carrera_id=' + this.carrera.id + '&periodo_lectivo_id=' + this.periodoLectivoActual.id +
            '&periodo_academico_id=' + this.periodoAcademico + '&records_per_page=' + this.records_per_page + '&page=' + page;
        this.service.get('matriculas/cupos' + parametros).subscribe(
            response => {
                this.cupos = response['cupos']['data'];
                this.total_pages = response['pagination']['last_page'];
                this.total_register = response['pagination']['total'];
                this.crearNumerosPaginacion();
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
            });
    }

    getCuposPorEstado(page: number, estado: string) {
        this.flagCuposEstado = true;
        this.estadoCupos = estado;
        this.flagPagination = true;
        this.buscador = '';
        this.spinner.show();
        this.getDetalleMatriculasForMalla();
        this.urlExportCuposPeriodoAcademico = environment.API_URL + 'exports/cupos_periodo_academico?carrera_id=' + this.carrera.id
            + '&periodo_academico_id=' + this.periodoAcademico + '&periodo_lectivo_id=' + this.periodoLectivoSeleccionado.id;
        this.urlExportCuposCarrera = environment.API_URL + 'exports/cupos_carrera?carrera_id=' + this.carrera.id
            + '&periodo_lectivo_id=' + this.periodoLectivoSeleccionado.id;
        this.urlExportMatrizSniese = environment.API_URL + 'exports/matriz_sniese?carrera_id=' + this.carrera.id
            + '&periodo_lectivo_id=' + this.periodoLectivoSeleccionado.id;
        this.actual_page = page;
        const parametros = '?carrera_id=' + this.carrera.id + '&periodo_lectivo_id=' + this.periodoLectivoActual.id +
            '&periodo_academico_id=' + this.periodoAcademico + '&records_per_page=' + this.records_per_page + '&page=' + page
            + '&estado=' + estado;
        this.service.get('matriculas/cupos/estado' + parametros).subscribe(
            response => {
                this.cupos = response['cupos']['data'];
                this.total_pages = response['pagination']['last_page'];
                this.total_register = response['pagination']['total'];
                this.crearNumerosPaginacion();
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
            });
    }

    getDetalleMatricula(matricula: Matricula) {
        this.spinner.show();
        this.detalleMatricula = null;
        this.flagAsignaturasCupo = true;
        this.matriculaSeleccionada = matricula;
        this.getAsignaturasCarrera();
        this.getTiposMatricula();
        this.service.get('detalle_matriculas?id=' + matricula.id).subscribe(
            response => {
                this.spinner.hide();
                this.detalleMatricula = response['detalle_matricula'];
            },
            error => {
                this.spinner.hide();
                swal.fire(this.messages['error500']);
            });
    }

    getDetalleMatriculasForMalla() {
        const parametros =
            '?carrera_id=' + this.carrera.id
            + '&periodo_lectivo_id=' + this.periodoLectivoActual.id
            + '&periodo_academico_id=' + this.periodoAcademico;
        this.service.get('detalle_matriculas/count' + parametros)
            .subscribe(
                response => {
                    this.total_detalle_matriculas_anulados = response['anulados_count'];
                    this.total_detalle_matriculas_en_proceso = response['en_proceso_count'];
                    this.total_detalle_matriculas_aprobados = response['aprobados_count'];
                    this.total_detalle_matriculas_matriculados = response['matriculados_count'];
                    this.total_detalle_matriculas_desertores = response['desertores_count'];
                },
                error => {
                });
    }

    getPeriodoAcademicos() {

        this.service.get('catalogos/periodo_academicos').subscribe(
            response => {
                this.peridoAcademicos = response['periodo_academicos'];
            },
            error => {
                this.spinner.hide();
            });
    }

    getPeriodoLectivoActual() {
        this.service.get('periodo_lectivos/actual').subscribe(
            response => {
                if (response['periodo_lectivo_actual'] == null) {
                    this.periodoLectivoActual = new PeriodoLectivo();
                } else {
                    this.periodoLectivoActual = response['periodo_lectivo_actual'];
                    this.txtPeridoActualHistorico = 'PERIODO LECTIVO ACTUAL';
                }
            },
            error => {

            });
    }

    getPeriodoLectivos() {
        this.service.get('periodo_lectivos').subscribe(
            response => {
                this.periodoLectivos = response['periodo_lectivos'];
            },
            error => {
                this.spinner.hide();
            });
    }

    getTiposMatricula() {
        this.service.get('tipo_matriculas').subscribe(
            response => {
                this.tiposMatricula = response['tipo_matriculas'];
            },
            error => {
                this.spinner.hide();
            });
    }

    async openDetalleMatricula(content) {
        const {value: razonNuevaAsignatura} = await swal.fire(this.messages['createInputQuestion']);
        if (razonNuevaAsignatura) {
            this.detalleMatriculaNuevo.matricula.id = this.matriculaSeleccionada.id;
            this.modalService.open(content)
                .result
                .then((resultModal => {
                    if (resultModal === 'save') {
                        this.createDetalleMatricula(razonNuevaAsignatura);
                    }
                }), (resultCancel => {

                }));
        } else {
            if (!(razonNuevaAsignatura === undefined)) {
                swal.fire('Motivo', 'Debe contener por lo menos un motivo', 'warning');
            }
        }
    }

    firstPagina() {
        if (this.flagCuposEstado) {
            this.getCuposPorEstado(1, this.estadoCupos);
        } else {
            this.getCupos(1);
        }

        this.total_pages_temp = 10;
        this.crearNumerosPaginacion();
    }

    lastPagina() {
        if (this.flagCuposEstado) {
            this.getCuposPorEstado(this.total_pages, this.estadoCupos);
        } else {
            this.getCupos(this.total_pages);
        }

        this.total_pages_temp = this.total_pages;
        this.crearNumerosPaginacion();
    }

    paginacion(siguiente: boolean) {
        if (siguiente) {
            if (this.actual_page === this.total_pages) {
                return;
            } else {
                if (this.total_pages_temp !== this.total_pages) {
                    this.total_pages_temp++;
                    this.crearNumerosPaginacion();
                }

                this.actual_page++;
            }
        } else {
            if (this.actual_page === 1) {
                return;
            } else {
                this.actual_page--;
                this.total_pages_temp--;
                this.crearNumerosPaginacion();
            }
        }

        if (this.flagCuposEstado) {
            this.getCuposPorEstado(this.actual_page, this.estadoCupos);
        } else {
            this.getCupos(this.actual_page);
        }

    }

    async updateMatricula(matricula: Matricula, campo: string) {
        console.log(matricula);
        const {value: razonModificarMatricula} = await swal.fire(this.messages['updateInputQuestion']);
        if (razonModificarMatricula) {
            this.spinner.show();
            this.service.update('matriculas/cupo', {'matricula': matricula})
                .subscribe(
                    response => {
                        if (this.buscador === '') {
                            if (this.flagCuposEstado) {
                                this.getCuposPorEstado(this.actual_page, this.estadoCupos);
                            } else {
                                this.getCupos(this.actual_page);
                            }
                        } else {
                            this.getCupo();
                        }
                        this.sendEmailNotificacion('cupos', 'Modificación de Matrícula: ' + campo, razonModificarMatricula);
                        this.spinner.hide();
                        swal.fire(this.messages['updateSuccess']);
                    },
                    error => {
                        this.spinner.hide();
                        swal.fire(this.messages['error500']);
                        this.getCupos(this.actual_page);
                    });
        } else {
            if (!(razonModificarMatricula === undefined)) {
                swal.fire('Motivo', 'Debe contener por lo menos un motivo', 'warning');
            }
            this.getCupos(this.actual_page);
        }
    }

    uploadCupos(ev) {
        if (this.periodoAcademico) {
            this.spinner.show();
            this.archivo = ev.target;
            if (this.archivo.files.length > 0) {
                const form = new FormData();
                form.append('archivo', this.archivo.files[0]);
                this.service.upload('imports/cupos?carrera_id=' + this.carrera.id, form).subscribe(
                    response => {
                        this.getCupos(1);
                        this.spinner.hide();
                        swal.fire('CARCA DE CUPOS',
                            '<li>' + ' Cupos Nuevos: ' + response['total_cupos_nuevos'] + '</li>' +
                            '<li>' + ' Cupos Modificados: ' + response['total_cupos_modificados'] + '</li>');
                        this.archivoTemp = '';
                        this.exportErroresCargaCupos(response['errores']);
                        this.sendEmailNotificacionCargaCupos('Cupos Nuevos: ' + response['total_cupos_nuevos'] +
                            ' - Cupos Modificados: ' + response['total_cupos_modificados']);
                    },
                    error => {
                        this.spinner.hide();
                        this.archivoTemp = '';
                        swal.fire(this.messages['uploadError']);
                    }
                );
            }
        } else {
            this.archivoTemp = '';
            swal.fire('Seleccione un periodo', '', 'warning');
        }
    }

    uploadMatriculas(ev) {
        this.spinner.show();
        this.archivo = ev.target;
        if (this.archivo.files.length > 0) {
            const form = new FormData();
            form.append('archivo', this.archivo.files[0]);
            this.service.upload('imports/matriculas', form).subscribe(
                response => {
                    this.getCupos(1);
                    this.spinner.hide();

                },
                error => {
                    this.spinner.hide();
                    alert('Error al subir el archivo');

                }
            );
        }
    }

    async updateDetalleMatricula(detalleMatricula: DetalleMatricula, campo: string) {
        const {value: razonModificarAsignatura} = await swal.fire(this.messages['updateInputQuestion']);
        if (razonModificarAsignatura) {
            this.spinner.show();
            this.service.update('detalle_matriculas/cupo', {'detalle_matricula': detalleMatricula})
                .subscribe(
                    response => {
                        this.getDetalleMatricula(this.matriculaSeleccionada);
                        this.sendEmailNotificacion('detalle_cupos', 'Modificación Asignatura: ' + campo,
                            razonModificarAsignatura);
                        this.spinner.hide();
                        swal.fire(this.messages['updateSuccess']);
                    },
                    error => {
                        this.spinner.hide();
                        if (error.error.errorInfo[0] === '23505') {
                            swal.fire(this.messages['error23505']);
                        } else {
                            swal.fire(this.messages['error500']);
                        }
                        this.getDetalleMatricula(this.matriculaSeleccionada);


                    });
        } else {
            if (!(razonModificarAsignatura === undefined)) {
                swal.fire('Motivo', 'Debe contener por lo menos un motivo', 'warning');
            }
            this.getDetalleMatricula(this.matriculaSeleccionada);
        }
    }

    validateCupo(cupo: Matricula) {
        swal.fire(this.messages['validateQuotaQuestion']).then((result) => {
            if (result.value) {
                this.spinner.show();
                this.service.get('matriculas/validate_cupo?matricula_id=' + cupo.id + '&estado=APROBADO').subscribe(
                    response => {
                        this.getCupos(this.actual_page);
                        this.spinner.hide();
                        swal.fire(this.messages['validateQuotaSuccess']);
                    },
                    error => {
                        this.spinner.hide();
                        swal.fire(this.messages['validateQuotaError']);
                    });
            }
        });
    }

    validateDetalleCupo(detalleCupo: DetalleMatricula) {
        swal.fire(this.messages['validateQuotaQuestion']).then((result) => {
            if (result.value) {
                this.spinner.show();
                this.service.get('matriculas/validate_cupo_asignatura?detalle_matricula_id=' + detalleCupo.id + '&estado=APROBADO').subscribe(
                    response => {
                        this.getDetalleMatricula(this.matriculaSeleccionada);
                        this.spinner.hide();
                        swal.fire(this.messages['validateQuotaSuccess']);
                    },
                    error => {
                        this.spinner.hide();
                        swal.fire(this.messages['validateQuotaError']);
                    });
            }
        });
    }

    validateCuposCarrera() {
        swal.fire(this.messages['validateQuotaQuestion'])
            .then((result) => {
                if (result.value) {
                    this.spinner.show();
                    this.service.get('matriculas/validate_cupos_carrera?carrera_id=' + this.carrera.id).subscribe(
                        response => {
                            this.getCupos(this.actual_page);
                            this.spinner.hide();
                            this.total_register = this.cupos.length;
                            swal.fire(this.messages['validateQuotaSuccess']);
                        },
                        error => {
                            this.spinner.hide();
                            swal.fire(this.messages['validateQuotaError']);
                        });
                }
            });
    }

    validateCuposPeriodoAcademico() {
        if (this.periodoAcademico !== '') {
            swal.fire(this.messages['validateQuotaQuestion'])
                .then((result) => {
                    if (result.value) {
                        this.spinner.show();
                        this.service.get('matriculas/validate_cupos_periodo_academico?carrera_id='
                            + this.carrera.id + '&periodo_academico_id='
                            + this.periodoAcademico)
                            .subscribe(
                                response => {
                                    this.getCupos(this.actual_page);
                                    this.spinner.hide();
                                    this.total_register = this.cupos.length;
                                    swal.fire(this.messages['validateQuotaSuccess']);
                                },
                                error => {
                                    this.spinner.hide();
                                    swal.fire(this.messages['validateQuotaError']);
                                });
                    }
                });
        } else {
            swal.fire('Seleccione un periodo académico', '', 'warning');
        }
    }

    exportCuposCarrera() {
        window.open(this.urlExportCuposCarrera);
    }

    exportListasPeriodo() {
        if (this.periodoAcademico) {
            window.open(this.urlExportListasPeriodoAcademico);
        } else {
            swal.fire('Seleccione un periodo', '', 'warning');
        }
    }

    exportCuposPeriodo() {
        if (this.periodoAcademico) {
            window.open(this.urlExportCuposPeriodoAcademico);
        } else {
            swal.fire('Seleccione un periodo', '', 'warning');
        }
    }

    async deleteCuposCarrera() {
        const {value: razonAnularAsignatura} = await swal.fire(this.messages['deleteInputQuestion']);
        if (razonAnularAsignatura) {
            swal.fire(this.messages['deleteQuestion'])
                .then((result) => {
                    if (result.value) {
                        this.spinner.show();
                        this.service.delete('matriculas/delete_cupos_carrera?carrera_id=' + this.carrera.id).subscribe(
                            response => {
                                this.getCupos(this.actual_page);
                                this.spinner.hide();
                                this.total_register = this.cupos.length;
                                this.messages['deleteSuccess']['text'] = response['cupos'] + ' ' + this.messages['deleteSuccess']['text'];
                                swal.fire(this.messages['deleteSuccess']);
                            },
                            error => {
                                this.spinner.hide();
                                swal.fire(this.messages['deleteError']);
                                this.getCupos(this.actual_page);
                            });
                    }
                });
        } else {
            if (!(razonAnularAsignatura === undefined)) {
                swal.fire('Motivo', 'Debe contener por lo menos un motivo', 'warning');
            }
        }

    }

    async deleteCuposPeriodoAcademico() {
        const {value: razonAnularAsignatura} = await swal.fire(this.messages['deleteInputQuestion']);
        if (razonAnularAsignatura) {
            if (this.periodoAcademico !== '') {
                swal.fire(this.messages['deleteQuestion'])
                    .then((result) => {
                        if (result.value) {
                            this.spinner.show();
                            this.service.delete('matriculas/delete_cupos_periodo_academico?carrera_id=' + this.carrera.id
                                + '&periodo_academico_id=' + this.periodoAcademico)
                                .subscribe(
                                    response => {
                                        this.getCupos(this.actual_page);
                                        this.spinner.hide();
                                        this.total_register = this.cupos.length;
                                        this.messages['deleteSuccess']['timer'] = 10000;
                                        this.messages['deleteSuccess']['text'] = response['cupos'] + ' ' + ' registro(s) eliminado(s)'
                                            + ', solo se elimaron los cupos EN_PROCESO';
                                        swal.fire(this.messages['deleteSuccess']);
                                    },
                                    error => {
                                        this.spinner.hide();
                                        swal.fire(this.messages['deleteError']);
                                        this.getCupos(this.actual_page);
                                    });
                        }
                    });
            } else {
                swal.fire('Seleccione un periodo académico', '', 'warning');
            }
        } else {
            if (!(razonAnularAsignatura === undefined)) {
                swal.fire('Motivo', 'Debe contener por lo menos un motivo', 'warning');
            }
        }
    }

    sendEmailNotificacionCargaCupos(body: string) {
        this.notificacion.carrera_id = this.carrera.id;
        this.notificacion.user_id = this.user.id;
        this.notificacion.asunto = 'CARGA DE CUPOS';
        this.notificacion.body = 'Periodo Academico: ' + this.periodoAcademico + ' - ' + body;
        this.service.post('emails/upload_cupos', this.notificacion)
            .subscribe(
                response => {
                    this.spinner.hide();
                },
                error => {
                    this.spinner.hide();
                    alert('error al enviar correo');
                });
    }

    getColumns() {
        return [
            {title: 'CARGA DE CUPOS', dataKey: 'errores'},
        ];
    }

    getbodyStyles() {
        return {
            fillColor: [255, 255, 255],
            textColor: 0,
            fontSize: 10
        };
    }

    getalternateRowStyles() {
        return {
            fillColor: [255, 255, 255],
            textColor: 0,
            fontSize: 10
        };
    }

    exportErroresCargaCupos(errores: any) {
        const doc = new jsPDF('p', 'pt');
        const rows = [];
        let flag = false;
        if (errores['estudiante']) {
            for (const iterator of errores['estudiante']) {
                flag = true;
                rows.push({
                    errores: iterator
                });
            }
        }
        if (errores['asignaturas']) {
            for (const iterator of errores['asignaturas']) {
                flag = true;
                rows.push({
                    errores: iterator
                });
            }
        }
        if (flag) {
            doc.autoTable(this.getColumns(), rows, {
                startY: 50,
                margin: {top: 205, right: 50, left: 50, bottom: 100},
                bodyStyles: this.getbodyStyles(),
                alternateRowStyles: this.getalternateRowStyles(),
                styles: {
                    cellPadding: 3,
                    fontSize: 10,
                    valign: 'middle',
                    overflow: 'linebreak',
                    lineWidth: 1,
                },
            });
            doc.save('carga_cupos' + '.pdf');
            window.open(doc.output('bloburl'));
        }
        this.spinner.hide();
    }

    sendEmailNotificacion(url: string, asunto: string, mensaje: string) {
        this.notificacion.user_id = this.user.id;
        this.notificacion.asunto = asunto;
        this.notificacion.body = mensaje;
        this.service.post('emails/' + url, this.notificacion)
            .subscribe(
                response => {

                },
                error => {
                    alert('error al enviar correo');
                });
    }

    getPeriodosLectivos() {
        this.spinner.show();
        this.service.get('periodo_lectivos/historicos').subscribe(
            response => {
                this.periodosLectivos = response['periodos_lectivos_historicos'];
                this.periodosLectivos.forEach(value => {
                    if (value.estado === 'ACTUAL') {
                        this.periodoLectivoSeleccionado = value;
                    }
                });
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
            });
    }

    cambiarPeriodoLectivoActual() {
        this.periodosLectivos.forEach(value => {
            if (value.id === this.periodoLectivoActual.id) {
                this.periodoLectivoSeleccionado = value;
                if (value.estado !== 'ACTUAL') {
                    this.txtPeridoActualHistorico = 'PERIODO LECTIVO HISTÓRICO';
                } else {
                    this.txtPeridoActualHistorico = 'PERIODO LECTIVO ACTUAL';
                }
                this.getCupos(1);
            }
        });
    }

    async desertMatricula(matricula: Matricula) {
        const {value: razonAnularMatricula} = await swal.fire(this.messages['deleteInputQuestion']);
        if (razonAnularMatricula) {
            swal.fire(this.messages['deleteRegistrationQuestion'])
                .then((result) => {
                    if (result.value) {
                        this.spinner.show();
                        this.service.delete('matriculas/desert?id=' + matricula.id).subscribe(
                            response => {
                                if (this.buscador.trim() === '') {
                                    this.getDetalleMatriculasForMalla();
                                    this.getCupos(this.actual_page);
                                } else {
                                    this.getCupo();
                                }
                                this.spinner.hide();
                                swal.fire(this.messages['deleteSuccess']);
                                this.sendEmailNotificacion('cupos', 'Desertar Estudiante', razonAnularMatricula);
                            },
                            error => {
                                this.spinner.hide();
                                swal.fire(this.messages['error500']);
                                this.getCupos(this.actual_page);
                            });
                    }
                });
        } else {
            if (!(razonAnularMatricula === undefined)) {
                swal.fire('Motivo', 'Debe contener por lo menos un motivo', 'warning');
            }
        }
    }

    validateFechaCupos() {
        if (this.fechaActual.getTime() >= this.periodoLectivoSeleccionado.fecha_inicio_cupo.getTime()
            && this.fechaActual.getTime() <= this.periodoLectivoSeleccionado.fecha_fin_cupo.getTime()) {

        }
    }

    exportMatrizSniese() {
        window.open(this.urlExportMatrizSniese);
    }

    getInformacionEstudiante(estudianteId: number, content) {
        this.spinner.show();
        this.service.get('cupos/estudiantes?id=' + estudianteId).subscribe(
            response => {
                this.estudianteSeleccionado = response['estudiante'];
                this.spinner.hide();
                const logoutScreenOptions: NgbModalOptions = {
                    size: 'lg'
                };
                this.modalService.open(content, logoutScreenOptions)
                    .result
                    .then((resultModal => {
                        if (resultModal === 'save') {
                            this.updateInformacionEstudiante();
                        }
                    }), (resultCancel => {

                    }));
            },
            error => {

            });
    }

    updateInformacionEstudiante(): void {
        this.spinner.show();
        this.service.update('cupos/estudiantes',
            {'estudiante': this.estudianteSeleccionado})
            .subscribe(
                response => {
                    this.getCupos(this.actual_page);
                    this.spinner.hide();
                },
                error => {
                    this.getCupos(this.actual_page);
                    this.spinner.hide();
                });

    }

    openDescargas(content) {
        this.modalService.open(content)
            .result
            .then((resultModal => {

            }), (resultCancel => {

            }));
    }

    uploadParalelos(ev) {
        if (this.periodoAcademico) {
            this.spinner.show();
            this.archivo = ev.target;
            if (this.archivo.files.length > 0) {
                const form = new FormData();
                form.append('archivo', this.archivo.files[0]);
                this.service.upload('imports/paralelos?carrera_id=' + this.carrera.id
                    + '&periodo_lectivo_id=' + this.periodoLectivoSeleccionado.id, form).subscribe(
                    response => {
                        this.getCupos(1);
                        this.spinner.hide();
                        swal.fire('CARCA DE PARALELOS', 'Se cargaron los paralelos', 'success');
                        this.archivoTemp = '';
                        this.exportErroresCargaCupos(response['errores']);
                    },
                    error => {
                        this.spinner.hide();
                        this.archivoTemp = '';
                        swal.fire(this.messages['uploadError']);
                    }
                );
            }
        } else {
            this.archivoTemp = '';
            swal.fire('Seleccione un periodo', '', 'warning');
        }
    }
}
