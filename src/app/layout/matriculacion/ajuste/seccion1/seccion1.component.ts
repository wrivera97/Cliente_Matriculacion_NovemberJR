import {Component, OnInit} from '@angular/core';
import {ServiceService} from '../../service.service';
import {Estudiante} from '../../modelos/estudiante.model';
import {Ubicacion} from '../../modelos/ubicacion.model';
import {catalogos} from '../../../../../environments/catalogos';
import {InformacionEstudiante} from '../../modelos/informacion-estudiante.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {Instituto} from '../../modelos/instituto.model';
import {Carrera} from '../../modelos/carrera.model';
import {User} from '../../modelos/user.model';
import {PeriodoLectivo} from '../../modelos/periodo-lectivo.model';
import swal from 'sweetalert2';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DetalleMatricula} from '../../modelos/detalle-matricula.model';

@Component({
    selector: 'app-seccion1',
    templateUrl: './seccion1.component.html',
    styleUrls: ['./seccion1.component.scss']
})
export class Seccion1Component implements OnInit {
    constructor(private spinner: NgxSpinnerService, private service: ServiceService, private modalService: NgbModal) {
    }

    periodosLectivos: Array<PeriodoLectivo>;
    periodoLectivoSeleccionado: PeriodoLectivo;
    messages: any;
    actual_page: number;
    records_per_page: number;
    total_pages: number;
    total_register: number;
    total_pages_pagination: Array<any>;
    total_pages_temp: number;
    flagPagination: boolean;

    ngOnInit() {
        this.flagPagination = true;
        this.total_pages_pagination = new Array<any>();
        this.total_pages_temp = 10;
        this.records_per_page = 7;
        this.actual_page = 1;
        this.total_pages = 1;
        this.periodosLectivos = new Array<PeriodoLectivo>();
        this.periodoLectivoSeleccionado = new PeriodoLectivo();
        this.messages = catalogos.messages;
        this.getPeriodosLectivos(1);
    }

    getPeriodosLectivos(page: number) {
        this.spinner.show();
        this.actual_page = page;
        const parameters = '?' + 'records_per_page=' + this.records_per_page
            + '&page=' + page;
        this.service.get('periodo_lectivos' + parameters).subscribe(
            response => {
                this.periodosLectivos = response['periodos_lectivos']['data'];
                this.total_pages = response['pagination']['last_page'];
                this.total_register = response['pagination']['total'];
                this.crearNumerosPaginacion();
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
            });
    }

    openPeriodoLectivo(content, periodoLectivo) {
        if (periodoLectivo != null) {
            this.periodoLectivoSeleccionado = periodoLectivo;
        } else {
            this.periodoLectivoSeleccionado = new PeriodoLectivo();
        }
        this.modalService.open(content)
            .result
            .then((resultModal => {
                if (resultModal === 'save') {
                    if (periodoLectivo == null) {
                        this.createPeriodoLectivo();
                    } else {
                        this.updatePeriodoLectivo();
                    }
                }
            }), (resultCancel => {

            }));

    }

    createPeriodoLectivo() {
        this.spinner.show();
        this.periodoLectivoSeleccionado.codigo = this.periodoLectivoSeleccionado.codigo;
        this.validateFechas();
        this.service.post('periodo_lectivos', {'periodo_lectivo': this.periodoLectivoSeleccionado}).subscribe(
            response => {
                this.getPeriodosLectivos(this.actual_page);
                swal.fire(this.messages['createSuccess']);
                this.spinner.hide();
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

    updatePeriodoLectivo() {
        this.spinner.show();
        this.validateFechas();
        this.service.update('periodo_lectivos', {'periodo_lectivo': this.periodoLectivoSeleccionado}).subscribe(
            response => {
                swal.fire(this.messages['updateSuccess']);
                this.spinner.hide();
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

    closePeriodoLectivo(periodoLectivo: PeriodoLectivo) {
        this.spinner.show();
        this.service.update('periodo_lectivos/cerrar', {'periodo_lectivo': periodoLectivo}).subscribe(
            response => {
                this.getPeriodosLectivos(this.actual_page);
                this.spinner.hide();
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

    deletePeriodoLectivo(periodoLectivo: PeriodoLectivo) {
        this.spinner.show();
        this.service.delete('periodo_lectivos?id=' + periodoLectivo.id).subscribe(
            response => {
                this.getPeriodosLectivos(this.actual_page);
                swal.fire(this.messages['deleteSuccess']);
                this.spinner.hide();
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

    activatePeriodoLectivo(periodoLectivo: PeriodoLectivo) {
        this.spinner.show();
        this.service.update('periodo_lectivos/activar', {'periodo_lectivo': periodoLectivo}).subscribe(
            response => {
                this.getPeriodosLectivos(this.actual_page);
                this.spinner.hide();
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

    validateFechas() {
        if (this.periodoLectivoSeleccionado.fecha_inicio_cupo == null) {
            this.periodoLectivoSeleccionado.fecha_inicio_cupo = this.periodoLectivoSeleccionado.fecha_inicio_periodo;
        }
        if (this.periodoLectivoSeleccionado.fecha_inicio_ordinaria == null) {
            this.periodoLectivoSeleccionado.fecha_inicio_ordinaria = this.periodoLectivoSeleccionado.fecha_inicio_periodo;
        }
        if (this.periodoLectivoSeleccionado.fecha_inicio_extraordinaria == null) {
            this.periodoLectivoSeleccionado.fecha_inicio_extraordinaria = this.periodoLectivoSeleccionado.fecha_inicio_periodo;
        }
        if (this.periodoLectivoSeleccionado.fecha_inicio_especial == null) {
            this.periodoLectivoSeleccionado.fecha_inicio_especial = this.periodoLectivoSeleccionado.fecha_inicio_periodo;
        }

        if (this.periodoLectivoSeleccionado.fecha_fin_cupo == null) {
            this.periodoLectivoSeleccionado.fecha_fin_cupo = this.periodoLectivoSeleccionado.fecha_fin_periodo;
        }
        if (this.periodoLectivoSeleccionado.fecha_fin_ordinaria == null) {
            this.periodoLectivoSeleccionado.fecha_fin_ordinaria = this.periodoLectivoSeleccionado.fecha_fin_periodo;
        }
        if (this.periodoLectivoSeleccionado.fecha_fin_extraordinaria == null) {
            this.periodoLectivoSeleccionado.fecha_fin_extraordinaria = this.periodoLectivoSeleccionado.fecha_fin_periodo;
        }
        if (this.periodoLectivoSeleccionado.fecha_fin_especial == null) {
            this.periodoLectivoSeleccionado.fecha_fin_especial = this.periodoLectivoSeleccionado.fecha_fin_periodo;
        }

    }

    crearNumerosPaginacion() {
        if (this.total_pages > 10) {
            for (let i = 0; i < 10; i++) {
                this.total_pages_pagination[i] = i + this.total_pages_temp - 9;
            }
        } else {
            this.total_pages_pagination = new Array<any>();
            for (let i = 0; i < this.total_pages; i++) {
                this.total_pages_pagination[i] = i + 1;
            }
        }
    }

    firstPagina() {
        this.getPeriodosLectivos(1);
        this.total_pages_temp = 10;
        this.crearNumerosPaginacion();
    }

    lastPagina() {
        this.getPeriodosLectivos(this.total_pages);
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
        this.getPeriodosLectivos(this.actual_page);
    }
}
