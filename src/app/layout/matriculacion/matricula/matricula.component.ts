import {Component, OnInit} from '@angular/core';
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
import kjua from 'kjua';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {DatePipe} from '@angular/common';
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner';
import html2canvas from 'html2canvas';
import {environment} from '../../../../environments/environment';
import {Notificacion} from '../modelos/notificacion.model';
import {autoTable} from 'jspdf-autotable';
import {User} from '../modelos/user.model';

@Component({
    selector: 'app-matricula',
    templateUrl: './matricula.component.html',
    styleUrls: ['./matricula.component.scss']
})

export class MatriculaComponent implements OnInit {
    jornadasOperativa: any;
    estados: any;
    fechaActual: Date;
    estudiantesHistoricos: Array<Estudiante>;
    periodoLectivoSeleccionado: PeriodoLectivo;
    txtPeriodoActualHistorico: string;
    buscadorEstudianteGeneral: string;
    periodosLectivos: Array<PeriodoLectivo>;
    archivoTemp: any;
    notificacion: Notificacion;
    doc: any;
    total_detalle_matriculas_anulados: number;
    total_detalle_matriculas_matriculados: number;
    total_detalle_matriculas_aprobados: number;
    total_detalle_matriculas_en_proceso: number;
    total_detalle_matriculas_desertores: number;
    urlExportCuposPeriodoAcademico: string;
    urlExportCuposCarrera: string;
    urlExportMatrizSniese: string;
    buscador: string;
    archivo: any;
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
    flagPagination: boolean;
    total_detalle_matriculas_for_malla: Array<any>;
    messages: any;
    matriculaSeleccionada: Matricula;
    carrera: Carrera;
    periodoAcademico: string;
    periodoLectivo: string;
    periodoLectivoActual: PeriodoLectivo;
    periodoLectivos: Array<PeriodoLectivo>;
    matriculados: Array<any>;
    matriculas: Array<Matricula>;
    carreras: Array<Carrera>;
    periodoAcademicos: Array<PeriodoAcademico>;
    rutaActual: string;
    user: User;

    constructor(private spinner: NgxSpinnerService, private service: ServiceService, private router: Router,
                private modalService: NgbModal) {
    }

    ngOnInit() {
        this.estados = catalogos.estados;
        this.buscadorEstudianteGeneral = '';
        this.fechaActual = new Date();
        this.estudiantesHistoricos = new Array<Estudiante>();
        this.periodoLectivoSeleccionado = new PeriodoLectivo();
        this.txtPeriodoActualHistorico = 'NO EXISTE UN PERIODO ABIERTO';
        this.user = JSON.parse(localStorage.getItem('user')) as User;
        this.buscador = '';
        this.notificacion = new Notificacion();
        this.flagPagination = true;
        this.total_detalle_matriculas_for_malla = new Array<any>();
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
        this.getCarreras();
        this.getPeriodoAcademicos();
        this.getPeriodoLectivoActual();
        this.getPeriodoLectivos();
        this.getTiposMatricula();
        this.getPeriodosLectivos();
    }

    createDetalleMatricula(razonNuevaAsignatura: string) {
        this.spinner.show();
        this.detalleMatriculaNuevo.estado = 'MATRICULADO';
        this.service.post('detalle_matriculas', {'detalle_matricula': this.detalleMatriculaNuevo}).subscribe(
            response => {
                this.getDetalleMatricula(this.matriculaSeleccionada);
                this.sendEmailNotificacion('detalle_cupos', 'Nueva Asignatura: ', razonNuevaAsignatura);
                this.detalleMatriculaNuevo = new DetalleMatricula();
                this.spinner.hide();
                swal.fire(this.messages['createSuccess']);
            },
            error => {
                this.spinner.hide();
                if (error.error.errorInfo[0] === '23505') {
                    swal.fire(this.messages['error23505']);
                } else {
                    swal.fire(this.messages['error500']);
                }
                this.detalleMatriculaNuevo = new DetalleMatricula();
            });
    }

    cambiarEstadoFlagAsignaturasCupo() {
        this.flagAsignaturasCupo = false;
        if (this.buscador.trim() === '') {
            this.getAprobados(this.actual_page);
        } else {
            this.getAprobado();
        }

    }

    crearNumerosPaginacion() {
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

    async deleteDetalleMatricula(detalleMatricula: DetalleMatricula, campo: string) {
        const {value: razonAnularAsignatura} = await swal.fire(this.messages['deleteInputQuestion']);
        if (razonAnularAsignatura) {
            swal.fire(this.messages['deleteRegistrationQuestion'])
                .then((result) => {
                    if (result.value) {
                        this.spinner.show();
                        this.service.delete('matriculas/delete_detalle_matricula?id=' + detalleMatricula.id).subscribe(
                            response => {
                                this.getDetalleMatricula(this.matriculaSeleccionada);
                                this.sendEmailNotificacion('detalle_cupos', 'Anulacion Asignatura: ' + campo, razonAnularAsignatura);
                                this.spinner.hide();
                                swal.fire(this.messages['deleteSuccess']);
                            },
                            error => {
                                this.spinner.hide();
                                swal.fire(this.messages['error500']);
                            });
                    }
                });
        } else {
            if (!(razonAnularAsignatura === undefined)) {
                swal.fire('Motivo', 'Debe contener por lo menos un motivo', 'warning');
            }
        }
    }

    async deleteMatricula(matricula: Matricula) {
        const {value: razonAnularMatricula} = await swal.fire(this.messages['deleteInputQuestion']);
        if (razonAnularMatricula) {
            swal.fire(this.messages['deleteRegistrationQuestion'])
                .then((result) => {
                    if (result.value) {
                        this.spinner.show();
                        this.service.delete('matriculas/matricula?id=' + matricula.id).subscribe(
                            response => {
                                if (this.buscador.trim() === '') {
                                    this.getDetalleMatriculasForMalla();
                                    this.getAprobados(this.actual_page);
                                } else {
                                    this.getAprobado();
                                }
                                this.sendEmailNotificacion('cupos', 'Anulación Matrícula', razonAnularMatricula);
                                this.spinner.hide();
                                swal.fire(this.messages['deleteSuccess']);

                            },
                            error => {
                                this.spinner.hide();
                                swal.fire(this.messages['error500']);
                            });
                    }
                });
        } else {
            if (!(razonAnularMatricula === undefined)) {
                swal.fire('Motivo', 'Debe contener por lo menos un motivo', 'warning');
            }
        }
    }

    async unregisterMatricula(matricula: Matricula) {
        const {value: razonAnularMatricula} = await swal.fire(this.messages['deleteInputQuestion']);
        if (razonAnularMatricula) {
            swal.fire(this.messages['deleteRegistrationQuestion'])
                .then((result) => {
                    if (result.value) {
                        this.spinner.show();
                        this.service.delete('matriculas/unregister?id=' + matricula.id).subscribe(
                            response => {
                                if (this.buscador.trim() === '') {
                                    this.getDetalleMatriculasForMalla();
                                    this.getAprobados(this.actual_page);
                                } else {
                                    this.getAprobado();
                                }
                                this.sendEmailNotificacion('cupos', 'Anulación Matrícula', razonAnularMatricula);
                                this.spinner.hide();
                                swal.fire(this.messages['deleteSuccess']);

                            },
                            error => {
                                this.spinner.hide();
                                swal.fire(this.messages['error500']);
                            });
                    }
                });
        } else {
            if (!(razonAnularMatricula === undefined)) {
                swal.fire('Motivo', 'Debe contener por lo menos un motivo', 'warning');
            }
        }
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
                                    this.getAprobados(this.actual_page);
                                } else {
                                    this.getAprobado();
                                }
                                this.sendEmailNotificacion('cupos', 'Desertar Estudiante', razonAnularMatricula);
                                this.spinner.hide();
                                swal.fire(this.messages['deleteSuccess']);

                            },
                            error => {
                                this.spinner.hide();
                                swal.fire(this.messages['error500']);
                            });
                    }
                });
        } else {
            if (!(razonAnularMatricula === undefined)) {
                swal.fire('Motivo', 'Debe contener por lo menos un motivo', 'warning');
            }
        }
    }

    getAsignaturasCarrera() {
        this.service.get('matriculas/asignaturas?carrera_id=' + this.carrera.id + '&matricula_id=' + this.matriculaSeleccionada.id)
            .subscribe(
                response => {
                    this.asignaturas = response['asignaturas'];
                },
                error => {
                    this.spinner.hide();
                    swal.fire(this.messages['error500']);
                });
    }

    getBarcodeData(text: string, size = 900) {
        return kjua({
            render: 'canvas',
            crisp: true,
            minVersion: 1,
            ecLevel: 'Q',
            size: size,
            ratio: undefined,
            fill: '#333',
            back: '#fff',
            text: text,
            rounded: 10,
            quiet: 2,
            mode: 'plain',
            mSize: 5,
            mPosX: 50,
            mPosY: 100,
            fontname: 'sans-serif',
            fontcolor: '#3F51B5',
            image: undefined
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
                this.getAprobados(1);
            } else {
                this.flagPagination = false;
                this.getAprobado();
            }
        }
    }

    filterEstudianteGeneral(event) {
        console.log(this.periodoLectivoActual.id);
        if (this.periodoLectivoActual.id !== 0) {
            if ((event.which === 1 || event.which === 13) && this.buscadorEstudianteGeneral.length > 0) {
                this.flagPagination = false;
                this.getAprobadoGeneral();
            }
        } else {
            swal.fire('Seleccione un Periodo Lectivo');
        }

    }

    getAprobado() {
        this.total_pages = 1;
        this.crearNumerosPaginacion();
        this.buscador = this.buscador.toUpperCase();
        const parametros =
            '?identificacion=' + this.buscador
            + '&apellido1=' + this.buscador
            + '&apellido2=' + this.buscador
            + '&nombre1=' + this.buscador
            + '&nombre2=' + this.buscador
            + '&carrera_id=' + this.carrera.id
            + '&periodo_lectivo_id=' + this.periodoLectivoSeleccionado.id;
        this.spinner.show();
        this.service.get('matriculas/aprobado' + parametros).subscribe(
            response => {
                this.cupos = response['cupo'];
                this.total_register = this.cupos.length;
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
                swal.fire(this.messages['error500']);
            });
    }

    getAprobadoGeneral() {
        this.buscadorEstudianteGeneral = this.buscadorEstudianteGeneral.toUpperCase();
        const parametros =
            '?identificacion=' + this.buscadorEstudianteGeneral
            + '&apellido1=' + this.buscadorEstudianteGeneral
            + '&apellido2=' + this.buscadorEstudianteGeneral
            + '&nombre1=' + this.buscadorEstudianteGeneral
            + '&nombre2=' + this.buscadorEstudianteGeneral
            + '&periodo_lectivo_id=' + this.periodoLectivoSeleccionado.id;
        this.spinner.show();
        this.service.get('estudiantes/historicos' + parametros).subscribe(
            response => {
                this.cupos = response['cupo'];
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
                swal.fire(this.messages['error500']);
            });
    }

    getAprobados(page: number) {
        this.flagPagination = true;
        if (this.carrera.id !== 0) {
            this.spinner.show();
            this.urlExportCuposPeriodoAcademico = environment.API_URL + 'exports/cupos_periodo_academico?carrera_id=' + this.carrera.id
                + '&periodo_academico_id=' + this.periodoAcademico + '&periodo_lectivo_id=' + this.periodoLectivoSeleccionado.id;
            this.urlExportCuposCarrera = environment.API_URL + 'exports/cupos_carrera?carrera_id=' + this.carrera.id
                + '&periodo_lectivo_id=' + this.periodoLectivoSeleccionado.id;
            this.urlExportMatrizSniese = environment.API_URL + 'exports/matriz_sniese?carrera_id=' + this.carrera.id
                + '&periodo_lectivo_id=' + this.periodoLectivoSeleccionado.id;
            this.actual_page = page;
            const parametros = '?carrera_id=' + this.carrera.id + '&periodo_lectivo_id=' + this.periodoLectivoSeleccionado.id +
                '&periodo_academico_id=' + this.periodoAcademico + '&records_per_page=' + this.records_per_page
                + '&page=' + page;
            this.service.get('matriculas/aprobados' + parametros).subscribe(
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
        } else {
            this.cupos = null;
        }
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
                this.detalleMatricula = response['detalle_matricula'];
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
                swal.fire(this.messages['error500']);
            });
    }

    getDetalleMatriculasForMalla() {
        if (this.carrera.id !== 0) {
            const parametros =
                '?carrera_id=' + this.carrera.id
                + '&periodo_lectivo_id=' + this.periodoLectivoSeleccionado.id
                + '&periodo_academico_id=' + this.periodoAcademico;
            this.service.get('detalle_matriculas/count' + parametros)
                .subscribe(
                    response => {

                        this.total_detalle_matriculas_anulados = response['anulados_count'];
                        this.total_detalle_matriculas_aprobados = response['aprobados_count'];
                        this.total_detalle_matriculas_matriculados = response['matriculados_count'];
                        this.total_detalle_matriculas_en_proceso = response['en_proceso_count'];
                        this.total_detalle_matriculas_desertores = response['desertores_count'];

                    },
                    error => {
                        this.spinner.hide();

                    });
        }
    }

    getPeriodoAcademicos() {

        this.service.get('catalogos/periodo_academicos').subscribe(
            response => {
                this.periodoAcademicos = response['periodo_academicos'];
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
                    this.periodoLectivoSeleccionado = response['periodo_lectivo_actual'];
                    this.periodoLectivoSeleccionado.fecha_fin_cupo = new Date(this.periodoLectivoActual.fecha_fin_cupo + 'T00:00:00');
                    this.txtPeriodoActualHistorico = 'PERIODO LECTIVO ACTUAL';
                }
            },
            error => {
                this.spinner.hide();

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
        this.getAprobados(1);
        this.total_pages_temp = 10;
        this.crearNumerosPaginacion();
    }

    lastPagina() {
        this.getAprobados(this.total_pages);
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
        this.getAprobados(this.actual_page);
    }

    async updateMatricula(matricula: Matricula, campo: string) {
        const {value: razonModificarMatricula} = await swal.fire(this.messages['updateInputQuestion']);
        if (razonModificarMatricula) {
            this.spinner.show();
            this.service.update('matriculas/matricula', {'matricula': matricula})
                .subscribe(
                    response => {
                        if (this.buscador.trim() === '') {
                            this.getAprobados(this.actual_page);
                        } else {
                            this.getAprobado();
                        }
                        this.sendEmailNotificacion('cupos', 'Modificación Matrícula: ' + campo,
                            razonModificarMatricula);
                        this.spinner.hide();
                        swal.fire(this.messages['updateSuccess']);
                    },
                    error => {
                        this.spinner.hide();
                        swal.fire(this.messages['error500']);
                    });
        } else {
            if (!(razonModificarMatricula === undefined)) {
                swal.fire('Motivo', 'Debe contener por lo menos un motivo', 'warning');
            }
            this.getAprobados(this.actual_page);
        }

    }

    async updateDetalleMatricula(detalleMatricula: DetalleMatricula, campo: string) {
        const {value: razonModificarAsignatura} = await swal.fire(this.messages['updateInputQuestion']);
        if (razonModificarAsignatura) {
            this.spinner.show();
            this.service.update('detalle_matriculas/matricula', {'detalle_matricula': detalleMatricula})
                .subscribe(
                    response => {
                        this.getDetalleMatricula(this.matriculaSeleccionada);
                        this.sendEmailNotificacion('detalle_cupos', 'Modificación Asignatura: ' + campo, razonModificarAsignatura);
                        this.spinner.hide();
                        swal.fire(this.messages['updateSuccess']);

                    },
                    error => {
                        this.spinner.hide();
                        swal.fire(this.messages['error500']);
                    });
        } else {
            if (!(razonModificarAsignatura === undefined)) {
                swal.fire('Motivo', 'Debe contener por lo menos un motivo', 'warning');
            }
            this.getDetalleMatricula(this.matriculaSeleccionada);
        }
    }

    matricular(cupo: Matricula) {
        swal.fire(this.messages['validateRegistrationQuestion'])
            .then((result) => {
                if (result.value) {
                    this.service.get('matriculas/validate_cupo?matricula_id=' + cupo.id + '&estado=MATRICULADO').subscribe(
                        response => {
                            this.getDetalleMatriculasForMalla();
                            this.getAprobados(this.actual_page);
                            // swal.fire(this.messages['validateRegistrationSuccess']);
                            this.getCertificadoMatricula(cupo);
                        },
                        error => {
                            this.spinner.hide();
                            swal.fire(this.messages['validateError']);
                        });
                }
            });

    }

    generateCertificado(datos: any, detalle: Array<any>) {
        if (datos['codigo']) {
            const inicioY = 60;
            const inicioX = 0;
            const barcodeData = this.getBarcodeData(environment.API_URL + 'certificado-matricula/' + datos['id']);
            const img = new Image();
            img.src = 'assets/images/logo_instituto_' + datos['instituto_id'] + '.png';
            this.doc = new jsPDF('p', 'pt');
            this.doc.addImage(barcodeData, 'JPG', 70, 30, 80, 80);
            if (datos['instituto_id'] === 1) {
                this.doc.addImage(img, 'JPG', 380, 60, img.width, img.height);
            }
            if (datos['instituto_id'] === 2 || datos['instituto_id'] === 3) {
                this.doc.addImage(img, 'JPG', 450, 30, img.width, img.height);
            }
            if (datos['instituto_id'] === 4) {
                this.doc.addImage(img, 'JPG', 425, 30, img.width, img.height);
            }

            this.doc.setFontSize(20);
            this.doc.setFontStyle('bold');
            this.doc.text('CERTIFICADO DE MATRÍCULA', 150, inicioY + 120);
            this.doc.setFontStyle('times');
            this.doc.setFontSize(12);
            this.doc.text(datos['fecha'], 425, inicioY + 70);
            this.doc.setFontStyle('bold');
            this.doc.text('MATRÍCULA:', 170, inicioY + 150);
            this.doc.text('FOLIO:', 395, inicioY + 150);
            this.doc.setFontStyle('times');
            this.doc.text(datos['codigo'], 150, inicioY + 170);
            this.doc.text(datos['folio'], 390, inicioY + 170);

            this.doc.setFontStyle('times');
            const apellidosEstudiante = datos['estudiante']['apellido1'] + ' ' + datos['estudiante']['apellido2'] + ' '
                + datos['estudiante']['nombre1'] + ' ' + datos['estudiante']['nombre2'];
            const texto = 'CERTIFICO que, ' + apellidosEstudiante + ', con cédula de ciudadanía N° ' + datos['estudiante']['identificacion']
                + ', previo cumpliento de los requisitos legales, se encuentra matriculado/a en ' + datos['periodo_academico']['nombre']
                + ' periodo académico de la carrera ' + datos['carrera']
                + ', para el periodo lectivo ' + datos['periodo_lectivo']['nombre']
                + ' con la inscripción en las siguientes asignaturas:';
            this.doc.setFontStyle('times');
            const splitTitle = this.doc.splitTextToSize(texto, 490);
            this.doc.text(50, inicioY + 225, splitTitle);
            const rows = [];
            for (const iterator of detalle) {
                rows.push({
                    codigo: iterator.asignatura_codigo,
                    asignatura: iterator.asignatura,
                    horas_docente: iterator.horas_docente,
                    horas_practica: iterator.horas_practica,
                    horas_autonoma: iterator.horas_autonoma,
                    periodo: iterator.periodo,
                    jornada: this.jornadas[iterator.jornada_asignatura - 1]['descripcion'],
                    numero_matricula: this.numerosMatricula[iterator.numero_matricula - 1]['descripcion']
                });
            }
            this.doc.autoTable(this.getColumns(), rows, {
                startY: inicioY + 300,
                margin: {top: 205, right: 50, left: 50, bottom: 100},
                bodyStyles: this.getbodyStyles(),
                alternateRowStyles: this.getalternateRowStyles(),
                headerStyles: this.getheaderStyles(),
                styles: {
                    cellPadding: 1,
                    fontSize: 8,
                    valign: 'middle',
                    overflow: 'linebreak',
                    tableWidth: 'auto',
                    lineWidth: 1,
                },
            }); // generando
            this.doc.text('Con sentimiento de distinguida consideración.', 70, inicioY + 600);
            this.doc.text('Atentamente,', 70, inicioY + 650);
            this.doc.setFontStyle('bold');
            this.doc.text('SECRETARÍA ACADÉMICA', 70, inicioY + 700);
            this.doc.text(datos['instituto'], 70, inicioY + 720);
            this.doc.save('CERTIFICADO-' + apellidosEstudiante + '-' + datos['codigo'] + '.pdf');
            this.doc.autoPrint();
            window.open(this.doc.output('bloburl'));

        }
    }

    getCertificadoMatricula(matricula: Matricula) {
        this.service.get('matriculas/certificado_matricula?matricula_id=' + matricula.id).subscribe(
            response => {
                if (response['certificado'].length > 0) {
                    this.generateCertificado(response['certificado'][0], response['certificado']);
                } else {
                    swal.fire('No existen asignaturas!', 'No se puede generar el certificado sin asignaturas!', 'warning');
                }
            },
            error => {
                this.spinner.hide();
                swal.fire(this.messages['error500']);
            });
    }

    getColumns() {
        return [
            {title: 'CÓDIGO', dataKey: 'codigo'},
            {title: 'ASIGNATURA', dataKey: 'asignatura'},
            {title: 'PERIODO', dataKey: 'periodo'},
            {title: 'NÚMERO MATRÍCULA', dataKey: 'numero_matricula'},
            {title: 'JORNADA', dataKey: 'jornada'},
            {title: 'H. DOCENTE', dataKey: 'horas_docente'},
            {title: 'H. PRÁCTICA', dataKey: 'horas_practica'},
            {title: 'H. AUTÓNOMA', dataKey: 'horas_autonoma'}
        ];
    }

    getheaderStyles() {
        const headerStyle = {
            fillColor: [255, 255, 255],
            textColor: 0,
            fontSize: 7
        };
        return headerStyle;
    }

    getbodyStyles() {
        const bodyStyle = {
            fillColor: [255, 255, 255],
            textColor: 0,
            fontSize: 7
        };
        return bodyStyle;
    }

    getalternateRowStyles() {
        const alternateRowStyle = {
            fillColor: [255, 255, 255],
            textColor: 0,
            fontSize: 7
        };
        return alternateRowStyle;
    }

    imprimir() {
        // return xepOnline.Formatter.Format('certificado', {
        //     render: 'download',
        //     filename: 'PDF'
        // });
    }

    exportCuposCarrera() {
        window.open(this.urlExportCuposCarrera);
    }

    exportCuposPeriodo() {
        if (this.periodoAcademico) {
            window.open(this.urlExportCuposPeriodoAcademico);
        } else {
            swal.fire('Seleccione un periodo', '', 'warning');
        }
    }

    exportMatrizSniese() {
        window.open(this.urlExportMatrizSniese);
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

    uploadNotas(ev) {

        this.spinner.show();
        this.archivo = ev.target;
        if (this.archivo.files.length > 0) {
            const form = new FormData();
            form.append('archivo', this.archivo.files[0]);
            this.service.upload('imports/notas?carrera_id=' + this.carrera.id + '&periodo_lectivo_id=4', form).subscribe(
                response => {
                    this.getAprobados(1);
                    this.spinner.hide();
                    swal.fire('CARCA DE PARALELOS');
                    this.archivoTemp = '';
                    // this.exportErroresCargaCupos(response['errores']);
                    // this.sendEmailNotificacionCargaCupos();
                },
                error => {
                    this.spinner.hide();
                    this.archivoTemp = '';
                    swal.fire(this.messages['uploadError']);
                }
            );
        }
    }

    cambiarPeriodoLectivoActual() {
        this.buscadorEstudianteGeneral = '';
        this.periodosLectivos.forEach(value => {
            // tslint:disable-next-line:triple-equals
            if (value.id == this.periodoLectivoActual.id) {
                this.periodoLectivoSeleccionado = value;
                // tslint:disable-next-line:triple-equals
                if (value.estado != 'ACTUAL') {
                    this.txtPeriodoActualHistorico = 'PERIODO LECTIVO HISTÓRICO';
                } else {
                    this.txtPeriodoActualHistorico = 'PERIODO LECTIVO ACTUAL';
                }
                this.getAprobados(1);
            }
        });
    }

    getPeriodosLectivos() {
        this.spinner.show();
        this.service.get('periodo_lectivos/historicos').subscribe(
            response => {
                this.periodosLectivos = response['periodos_lectivos_historicos'];
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
            });
    }
}
