import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {catalogos} from '../../../../environments/catalogos';
import {ServiceService} from '../notas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {PeriodoLectivo} from '../modelos/periodo-lectivo.model';
import {Carrera} from '../modelos/carrera.model';
import {User} from '../modelos/user.model';
import {DocenteAsignatura} from '../modelos/docente-asignaturas.model';
import {Matricula} from '../modelos/matricula.model';
import {DetallenotaModel} from '../modelos/detallenota.model';
import swal from "sweetalert2";
@Component({
  selector: 'app-nota-asistencia',
  templateUrl: './nota-asistencia-docente.component.html',
  styleUrls: ['./nota-asistencia-docente.component.scss']
})
export class NotaAsistenciaDocenteComponent implements OnInit {
    flagAll: boolean;
    txtPeridoActualHistorico: string;
    estados: any;

    periodoLectivoSeleccionado: PeriodoLectivo;
    txtPeriodoActualHistorico: string;
    periodoLectivoActual: PeriodoLectivo;

    periodoLectivo: string;
    periodosLectivos: Array<PeriodoLectivo>;
    periodoLectivos: Array<PeriodoLectivo>;

    detalleDocenteAsignatura: Array<DocenteAsignatura>;
    detalleDocenteAsignaturaSeleccionado: DocenteAsignatura;
    docenteasignaturauserseleccionado: DocenteAsignatura;

    carreras: Array<Carrera>;
    carrera: Carrera;

    DetalleEstudiante: Array <Matricula>;
    DetalleEstudianteSeleccionado: Matricula;


    detallenotanuevo: DetallenotaModel;



    messages: any;
    user: User;
    jornadas: Array<any>;
    paralelos: Array<any>;



    constructor(private spinner: NgxSpinnerService, private NotasService: ServiceService,
                private router: Router) {
    }

    ngOnInit() {
        this.txtPeriodoActualHistorico = 'NO EXISTE UN PERIODO ABIERTO';
        this.flagAll = false;
        this.user = JSON.parse(localStorage.getItem('user')) as User;
        this.periodoLectivo = '';
        this.estados = catalogos.estados;
        this.detallenotanuevo = new DetallenotaModel();
        this.messages = catalogos.messages;
        this.periodoLectivoSeleccionado = new PeriodoLectivo();
        this.periodoLectivoActual = new PeriodoLectivo();
        this.paralelos = catalogos.paralelos;
        this.jornadas = catalogos.jornadas;
        this.detalleDocenteAsignaturaSeleccionado = new DocenteAsignatura();
        this.docenteasignaturauserseleccionado = new  DocenteAsignatura();
        this.DetalleEstudianteSeleccionado = new Matricula();
        this.getPeriodoLectivoActual();
        this.getPeriodoLectivos();
        this.getPeriodosLectivos();
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
                this.getDocenteAsignaturasUser(this.periodoLectivoActual);
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
            if (value.id == this.periodoLectivoActual.id) {
                this.periodoLectivoSeleccionado = value;
                if (value.estado != 'ACTUAL') {
                    this.txtPeriodoActualHistorico = 'PERIODO LECTIVO HISTÓRICO';
                } else {
                    this.txtPeriodoActualHistorico = 'PERIODO LECTIVO ACTUAL';
                }
                this.getDocenteAsignaturasUser(this.periodoLectivoSeleccionado);
            }

        });

    }

    getDocenteAsignaturasUser(periodoLectivoActual) {
        this.flagAll = false;
        this.spinner.show();
        const parametros =
            '?id=' + this.user.id
            + '&periodo_lectivo_id=' + periodoLectivoActual.id;
        this.NotasService.get('testnotas' + parametros).subscribe(
            Response => {
                this.detalleDocenteAsignatura = Response['ok'];
                this.spinner.hide();
            });


    }
    getdetalleasignaturaestudiantes(detalleDocente: DocenteAsignatura) {
        this.flagAll = true;
        this.spinner.hide();
        this.detalleDocenteAsignaturaSeleccionado = detalleDocente;
        const  parametros =
            '?asignatura_id=' + this.detalleDocenteAsignaturaSeleccionado.asignatura.id
                  + '&paralelo=' + this.detalleDocenteAsignaturaSeleccionado.paralelo
                  + '&jornada=' + this.detalleDocenteAsignaturaSeleccionado.jornada
                  + '&periodo_lectivo_id=' + this.periodoLectivoSeleccionado.id;

        this.NotasService.get('testnotas1' + parametros).subscribe(
            Response => {
                this.DetalleEstudiante = Response['detalle_estudiante'];
                console.log(Response);
            },
        error => {
                alert('Error de servidor');

            });
    }


    createDetalleNotas(detalleEstudiante: Matricula) {
        this.DetalleEstudianteSeleccionado = detalleEstudiante;
        this.detallenotanuevo.docente_asignatura.id = this.detalleDocenteAsignaturaSeleccionado.id;
        this.detallenotanuevo.estudiante.id = this.DetalleEstudianteSeleccionado.estudiante.id;
        /*prueba de datos enviados al bdd y backend*/
        this.detallenotanuevo.nota1 = '100';
        this.detallenotanuevo.nota2 = '100';
        this.detallenotanuevo.nota_final = '100';
        this.detallenotanuevo.asistencia1 = '90';
        this.detallenotanuevo.asistencia2 = '90';
        this.detallenotanuevo.asistencia_final = '90';
        this.detallenotanuevo.estado_academico = 'APROBADO';

        this.NotasService.post('notaDetalle', {'detalle_nota' : this.detallenotanuevo}).subscribe(
            response => {
               this.detallenotanuevo = new DetallenotaModel();
                swal.fire(this.messages['createSuccess']);
            },
            error => {
                alert('error de servidor');
            });
    }

}
