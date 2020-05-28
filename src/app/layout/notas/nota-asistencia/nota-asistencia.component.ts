import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {catalogos} from '../../../../environments/catalogos';
import {ServiceService} from '../notas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {PeriodoLectivo} from '../modelos/periodo-lectivo.model';
import {Carrera} from '../modelos/carrera.model';
import {User} from '../modelos/user.model';
import {DocenteAsignatura} from '../modelos/docente-asignaturas.model';
import {Estudiante} from '../../matriculacion/modelos/estudiante.model';
import {Matricula} from '../../matriculacion/modelos/matricula.model';
@Component({
  selector: 'app-nota-asistencia',
  templateUrl: './nota-asistencia.component.html',
  styleUrls: ['./nota-asistencia.component.scss']
})
export class NotaAsistenciaComponent implements OnInit {
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

    carreras: Array<Carrera>;
    carrera: Carrera;

    estudiantedetalles: Array <Matricula>;




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
        this.messages = catalogos.messages;
        this.periodoLectivoSeleccionado = new PeriodoLectivo();
        this.periodoLectivoActual = new PeriodoLectivo();
        this.paralelos = catalogos.paralelos;
        this.jornadas = catalogos.jornadas;
        this.detalleDocenteAsignaturaSeleccionado = new DocenteAsignatura();
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
                  + '&jornada=' + this.detalleDocenteAsignaturaSeleccionado.jornada ;

        this.NotasService.get('testnotas1' + parametros).subscribe(
            Response => {
                this.estudiantedetalles = Response['ok'];
            },
        error => {
                alert('Error de servidor');

            });
    }




}
