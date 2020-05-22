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
import {Asignatura} from '../modelos/asignatura.model';
import { Docente } from '../modelos/docente.model';
import {error} from 'util';


@Component({
  selector: 'app-docente-asignatura',
  templateUrl: './docente-asignatura.component.html',
  styleUrls: ['./docente-asignatura.component.scss']
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
  constructor(private spinner: NgxSpinnerService, private NotasService: ServiceService , private router: Router,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.txtPeriodoActualHistorico = 'NO EXISTE UN PERIODO ABIERTO';
    this.flagAll = false;


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
    this.docenteSeleccionado = new Docente();
    this.paralelos = catalogos.paralelos;
    this.jornadas = catalogos.jornadas;
    this.periodoLectivoActual = new PeriodoLectivo();
    this.carrera = new Carrera();
    this.periodo_academico = new PeriodoAcademico();
    this.periodo_lectivo = new PeriodoLectivo();
    this.detalleDocenteasignaturaNuevo = new DocenteAsignatura();
    this.detalleDocenteSeleccionado  = new DocenteAsignatura();
    this.getDocentesAsignados();
    this.getCarreras();
    this.getPeriodoAcademicos();
    this.getPeriodoLectivoActual();
    this.getPeriodoLectivos();
    this.getPeriodosLectivos();

  }

  getPeriodoAcademicos() {

    this.NotasService.get('catalogos/periodo_academicos').subscribe(
        response => {
            this.periodo_academicos = response['periodo_academicos'];
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
getDocentesAsignados() { // funcion o metodo { abrimos
this.flagAll = false; // paginacion en caso de mostrar en otra pagina
this.spinner.show(); // muestra animacion de cargar
this.NotasService.get('detalleDocentes').subscribe(// nos subscribimos
    Response => {
        this.docenteDetalle = Response ['detalleDocentes']; // llamamos desde el response para obtener datos
       // console.log(Response)//muestra datos en consola
this.spinner.hide(); // ocultamos la animacion de carga
    },
    error => { // sintaxis de error en caso de existir alguno
this.spinner.hide(); // ocultamos animacion
}); // cierre del subcribe y response
    } // funcion o metodo }cerramos
        getDetalleDocente(docente: Docente) {
            this.spinner.show();
            this.detalleDocente = null;
            this.flagAll = true;
            this.docenteSeleccionado = docente;
            this.NotasService.get('asignacionDocentes?id=' + this.docenteSeleccionado.id
                                                           + '&periodo_lectivo_id=' + this.periodoLectivoActual.id).subscribe(
                Response => {

                    this.detalleDocente = Response['asignacionesDocente'];
                    console.log(Response);
                    this.spinner.hide();
                },
                error => {
                    this.spinner.hide();
                    swal.fire(this.messages['error500']);
                });
        }

        createDetalleDocenteAsignatura() {
         this.spinner.show();
         this.detalleDocenteasignaturaNuevo.estado = 'ACTIVO';
           this.NotasService.post('asignacionDocentes', {'docente_asignatura': this.detalleDocenteasignaturaNuevo})
            .subscribe(
            response => {
                this.getDetalleDocente(this.docenteSeleccionado);
                this.detalleDocenteasignaturaNuevo = new DocenteAsignatura();
                this.spinner.hide();
                swal.fire(this.messages['createSuccess']);
            },
            error => {
                this.spinner.hide();
                if (error.error.errorInfo === '23505') {
                    swal.fire(this.messages['error23505']);
                } else {
                    swal.fire(this.messages['error500']);
                }
                this.detalleDocenteasignaturaNuevo = new DocenteAsignatura();
            });
            }

            updateDetalleDocenteAsignatura(detalledocente: DocenteAsignatura) {
                this.spinner.show();
                  this.NotasService.update('asignacionDocentes', {'docente_asignatura': detalledocente }).subscribe(
                   response => {
                    this.getDetalleDocente(this.docenteSeleccionado);
                    this.spinner.hide();
                       swal.fire(this.messages['updateSuccess']);
                   },
                   error => {
                       this.spinner.hide();
                           swal.fire(this.messages['error500']);
                   });
            }
async deleteAsignaturaDocente(detalledocente: DocenteAsignatura) {
            const {value: razonEliminarAsignatura} = await swal.fire(this.messages['deleteInputAccept']);
if (razonEliminarAsignatura) {
    swal.fire(this.messages['deleteInputAccept'])
                .then((result) => {
                    if (result.value) {
                        this.spinner.show();
                        this.NotasService.delete('asignacionDocentes?id=' + detalledocente.id).subscribe(
                         response => {
             this.getDetalleDocente(this.docenteSeleccionado);
             this.spinner.show();
             console.log(response);
             swal.fire(this.messages['deleteSuccess']);
        },
        error => {
            this.spinner.hide();
            swal.fire(this.messages['error500']);
                           });
                        }
                    });
} else {
    if (!(razonEliminarAsignatura === undefined)) {
        swal.fire('Motivo', 'Debe contener por lo menos un motivo', 'warning');
    }
    }
    }

 opendetalledocenteasignaturas(content) {
        this.detalleDocenteasignaturaNuevo.docente.id = this.docenteSeleccionado.id;
         this.detalleDocenteasignaturaNuevo.periodo_lectivo.id = this.periodoLectivoActual.id;
                this.modalService.open(content)
            .result
            .then((resultModal => {
                if (resultModal === 'save') {
                    this.createDetalleDocenteAsignatura();
                }
            }), (resultCancel => {

            }));
    }

async opendetalledocenteasignaturasUpdate(content) {
    const {value: razonUpdateAsignatura} = await swal.fire(this.messages['UpdateQuestionAccept']);
    if (razonUpdateAsignatura) {
        this.modalService.open(content)
            .result
            .then((resultModal => {
                if (resultModal === 'save') {
  this.updateDetalleDocenteAsignatura(razonUpdateAsignatura);
                }
            }), (resultCancel => {

            }));
    } else {
        if (!(razonUpdateAsignatura === undefined)) {
            swal.fire('Motivo', 'Debe contener por lo menos un motivo', 'warning');
        }
    }
}
getCarreras() {
    this.spinner.show();
    this.NotasService.get('carreras').subscribe(
        Response => {
            this.carreras = Response ['carreras'];
            this.spinner.hide();
        },
        error => {
            this.spinner.hide();

        });
}
getAsignaturasCarrera() {
    this.NotasService.get('matriculas/asignaturas?carrera_id=' + this.carrera.id).subscribe(
        response => {
            this.spinner.hide();
            this.asignaturas = response['asignaturas'];
        },
        error => {
            this.spinner.hide();
            swal.fire(this.messages['error412']);
        });
}

/*getAsignaturasCarreraNivel() {
    this.NotasService.get('testnivel?carrera_id=' + this.carrera.id + '&periodo_academico_id=' + this.periodo_academico.id).subscribe(
        response => {
            this.asignaturas = response['asignaturas'];
        },
        error => {
            this.spinner.hide();
            swal.fire(this.messages['error500']);
        });
}*/

}
