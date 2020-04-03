import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {catalogos} from '../../../../environments/catalogos';
import {ServiceService} from '../notas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {PeriodoAcademico} from '../modelos/periodo-academico.model';
import {PeriodoLectivo} from '../modelos/periodo-lectivo.model';
import {Carrera} from '../modelos/carrera.model';
import {Asignatura} from '../modelos/asignatura.model';
@Component({
  selector: 'app-nota-asistencia',
  templateUrl: './nota-asistencia.component.html',
  styleUrls: ['./nota-asistencia.component.scss']
})
export class NotaAsistenciaComponent implements OnInit {
  flagAll: boolean;
  txtPeridoActualHistorico: string;
  estados: any;

  periodo_academicos: Array<PeriodoAcademico>;
  periodo_academico: PeriodoAcademico;

  periodoLectivoSeleccionado: PeriodoLectivo;
  txtPeriodoActualHistorico: string;
  periodoLectivoActual: PeriodoLectivo;

periodoLectivo: string;
periodosLectivos: Array<PeriodoLectivo>;

periodoLectivos: Array<PeriodoLectivo>;

carreras: Array<Carrera>;
carrera: Carrera;

asignaturas: Array<Asignatura>;




  constructor(private spinner: NgxSpinnerService, private NotasService: ServiceService ,
    private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    this.txtPeriodoActualHistorico = 'NO EXISTE UN PERIODO ABIERTO';
    this.flagAll = false;


    this.periodoLectivo = '';
    this.estados = catalogos.estados;
    this.periodoLectivoSeleccionado = new PeriodoLectivo();
    this.periodoLectivoActual = new PeriodoLectivo();
    this.carrera = new Carrera();
    this.periodo_academico = new PeriodoAcademico();
    this.getCarreras();
    this.getPeriodoAcademicos();
    this.getPeriodoLectivoActual();
    this.getPeriodoLectivos();
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
                this.txtPeridoActualHistorico = 'PERIODO LECTIVO ACTUAL';
            }
        },
        error => {

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
        }
    });
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

}
