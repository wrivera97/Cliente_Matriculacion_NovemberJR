import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ServiceService} from '../notas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {PeriodoAcademico} from '../modelos/periodo-academico.model';
import {PeriodoLectivo} from '../modelos/periodo-lectivo.model';
import {Carrera} from '../modelos/carrera.model';
import { DocenteAsignatura } from '../modelos/docente-asignaturas.model';
import {catalogos} from '../../../../environments/catalogos';
import { Docente } from '../modelos/docente.model';

@Component({
  selector: 'app-docente-asignatura',
  templateUrl: './docente-asignatura.component.html',
  styleUrls: ['./docente-asignatura.component.scss']
})
export class DocenteAsignaturaComponent implements OnInit {
    periodoAcademicos: Array<PeriodoAcademico>;
    periodoLectivoSeleccionado: PeriodoLectivo;
    buscador: string;
    flagPagination: boolean;
    txtPeriodoActualHistorico: string;
    periodoAcademico: string;
    periodoLectivo: string;
    periodosLectivos: Array<PeriodoLectivo>;
    periodoLectivoActual: PeriodoLectivo;
    periodoLectivos: Array<PeriodoLectivo>;
    detalleDocente: Array<DocenteAsignatura>;
    flagAll: boolean;
    messages: any;
    carreras: Array<Carrera>;
    actual_page: number;
    records_per_page: number;
    total_pages: number;
    total_register: number;
    total_pages_pagination: Array<any>;
    total_pages_temp: number;
    carrera: Carrera;
    docenteAsignatura: Array<DocenteAsignatura>;
    docenteSeleccionado: DocenteAsignatura;

  constructor(private spinner: NgxSpinnerService, private NotasService: ServiceService , private router: Router,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.txtPeriodoActualHistorico = 'NO EXISTE UN PERIODO ABIERTO';
    this.flagAll = false;
    this.periodoAcademico = '';
    this.buscador = '';
    this.periodoLectivo = '';

    this.actual_page = 1;
    this.flagPagination = true;
    this.messages = catalogos.messages;
    this.total_pages_pagination = new Array<any>();
    this.total_pages_temp = 10;
    this.records_per_page = 5;
    this.actual_page = 1;
    this.total_pages = 1;


    this.periodoLectivoSeleccionado = new PeriodoLectivo();
    this.docenteSeleccionado = new DocenteAsignatura();
    this.periodoLectivoActual = new PeriodoLectivo();
    this.carrera = new Carrera();


   /* this.getCarreras(); */
this.getDocentesAsignados(this.actual_page);
    this.getPeriodoAcademicos();
    this.getPeriodoLectivoActual();
    this.getPeriodoLectivos();
    this.getPeriodosLectivos();

  }

  getPeriodoAcademicos() {

    this.NotasService.get('catalogos/periodo_academicos').subscribe(
        response => {
            this.periodoAcademicos = response['periodo_academicos'];
        },
        error => {
            this.spinner.hide();

        });
}

getPeriodoLectivoActual() {
    this.NotasService.get('periodo_lectivos/actual').subscribe(
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
    this.NotasService.get('periodo_lectivos').subscribe(
        response => {
            this.periodoLectivos = response['periodo_lectivos'];
        },
        error => {
            this.spinner.hide();

        });
}

getPeriodosLectivos() {
    this.spinner.show();
    this.NotasService.get('periodo_lectivos/historicos').subscribe(
        response => {
            this.periodosLectivos = response['periodos_lectivos_historicos'];
            this.spinner.hide();
        },
        error => {
            this.spinner.hide();
        });
}

cambiarPeriodoLectivoActual() {
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
        }
    });
}
//////////////////////////////////////////////////////////////
getDocentesAsignados(page: number) {
    this.flagPagination = true;

    this.spinner.show();
this.NotasService.get('asignacionDocentestest1').subscribe(
    Response => {
        this.docenteAsignatura = Response ['test1'];
        this.spinner.show();
        console.log(Response);
    },
    error => {
this.spinner.hide();
});
    }

    cambiarEstadoFlagDocenteAsignaturas() {
        this.flagAll = false;
        if (this.buscador.trim() === '') {
        } else {

        }

    }


        getDetalleDocente(docente: DocenteAsignatura) {
            this.spinner.show();
            this.detalleDocente = null;
            this.flagAll = true;
            this.docenteSeleccionado = docente;

            // tslint:disable-next-line:max-line-length
            this.NotasService.get('asignacionDocentes?id=' + this.docenteSeleccionado.docente.id + '&periodo_lectivo_id=' + this.periodoLectivoActual.id).subscribe(
                response => {
                    this.detalleDocente = response['asignacionesDocente'];

                    this.spinner.hide();
                },
                error => {
                    this.spinner.hide();
                    swal.fire(this.messages['error500']);
                });
        }



async deleteAsignaturaDocente(docenteAsignatura: DocenteAsignatura) {
            const {value: razonEliminarAsignatura} = await swal.fire(this.messages['deleteInputQuestion']);
if (razonEliminarAsignatura) {
    swal.fire(this.messages['deleteRegistrationQuestion'])
                .then((result) => {
                    if (result.value) {
                        this.spinner.show();
                        this.NotasService.delete('asignacionDocentes?id=' + docenteAsignatura.id).subscribe(
         response => {

console.log(response);
            this.spinner.hide();
         });

         }

                        });

} else {
    if (!(razonEliminarAsignatura === undefined)) {
        swal.fire('Motivo', 'Debe contener por lo menos un motivo', 'warning');
    }


}
}

/* sacar carreras con el id de usuario o no??

getCarreras() {
    this.spinner.show();
    this.NotasService.get('catalogos/carreras').subscribe(
        Response => {
            this.carreras = Response ['carreras'];
            this.spinner.hide();
        },
        error => {
            this.spinner.hide();

        });
}
*/
}


