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
import swal from 'sweetalert2';
import {EvaPregunta} from '../../modelos/eva-pregunta.model';

@Component({
    selector: 'app-seccion1',
    templateUrl: './evaluacion.component.html',
    styleUrls: ['./evaluacion.component.scss']
})
export class EvaluacionComponent implements OnInit {
    constructor(private spinner: NgxSpinnerService, private service: ServiceService) {
    }

    evaPreguntas: Array<EvaPregunta>;
    errors: Array<string>;
    codigoProvincial: string;
    ubicacionNacimiento: any;
    ubicacionResidencia: any;
    estadoDatos: string;
    instituto: Instituto;
    carrera: Carrera;
    estudiante: Estudiante;
    informacionEstudiante: InformacionEstudiante;
    paises: Array<Ubicacion>;
    provincias: Array<Ubicacion>;
    cantones: Array<Ubicacion>;
    sexos: Array<any>;
    generos: Array<any>;
    etnias: Array<any>;
    estadosCiviles: Array<any>;
    tiposDocumentos: Array<any>;
    tiposSangre: Array<any>;
    tiposDiscapacidad: Array<any>;
    user: User;

    ngOnInit() {
        this.evaPreguntas = new Array<EvaPregunta>();
        this.codigoProvincial = '02';
        this.estadoDatos = '';
        this.user = JSON.parse(localStorage.getItem('user')) as User;
        this.estudiante = new Estudiante();
        this.informacionEstudiante = new InformacionEstudiante();
        this.sexos = catalogos.sexos;
        this.tiposDiscapacidad = catalogos.tiposDiscapacidad;
        this.tiposDocumentos = catalogos.tiposIdentificacion;
        this.generos = catalogos.generos;
        this.tiposSangre = catalogos.tiposSangre;
        this.etnias = catalogos.etnias;
        this.estadosCiviles = catalogos.estadosCivil;
        this.getEvaPreguntas();


    }

    updateEstudiante(): void {
        if (this.validateCampos()) {
            if (this.informacionEstudiante.telefono_fijo != null && this.informacionEstudiante.telefono_fijo != '') {
                this.informacionEstudiante.telefono_fijo = this.codigoProvincial + this.informacionEstudiante.telefono_fijo;
            }
            this.service.update('estudiantes/update_perfil',
                {'estudiante': this.estudiante, 'informacion_estudiante': this.informacionEstudiante})
                .subscribe(
                    response => {
                        this.getEstudiante();
                    },
                    error => {
                        this.getEstudiante();
                    });
        } else {
            let listaErrores = '';
            this.errors.forEach(value => {
                listaErrores = '<li>' + value + '</li>';
            });
            swal.fire('Errores en los siguientes campos', listaErrores, 'error');
        }
    }

    getEvaPreguntas() {
        this.spinner.show();
        this.service.get('estudiantes/eva_preguntas?user_id=' + this.user.id + '&periodo_lectivo_id=4').subscribe(
            response => {
                this.evaPreguntas = response['eva_preguntas'];

                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
                // if (error.status === 401) {
                //   swal({
                //     position: this.messages['createError401']['position'],
                //     type: this.messages['createError401']['type'],
                //     title: this.messages['createError401']['title'],
                //     text: this.messages['createError401']['text'],
                //     showConfirmButton: this.messages['createError401']['showConfirmButton'],
                //     backdrop: this.messages['createError401']['backdrop']
                //   });
                // }
            });
    }

    getEstudiante() {
        this.estadoDatos = 'Guardando...';
        this.service.get('estudiantes/' + this.user.id).subscribe(
            response => {
                this.estudiante = response['estudiante'];
                this.informacionEstudiante = response['informacion_estudiante'];
                this.estadoDatos = '';
                if (this.informacionEstudiante.telefono_fijo != null && this.informacionEstudiante.telefono_fijo != '') {
                    this.codigoProvincial = this.informacionEstudiante.telefono_fijo.substring(0, 2);
                    this.informacionEstudiante.telefono_fijo =
                        this.informacionEstudiante.telefono_fijo.substring(2, this.informacionEstudiante.telefono_fijo.length);
                } else {
                    this.codigoProvincial = '02';
                }
            },
            error => {
                this.estadoDatos = '';
                // this.spinner.hide();
                // if (error.status === 401) {
                //   swal({
                //     position: this.messages['createError401']['position'],
                //     type: this.messages['createError401']['type'],
                //     title: this.messages['createError401']['title'],
                //     text: this.messages['createError401']['text'],
                //     showConfirmButton: this.messages['createError401']['showConfirmButton'],
                //     backdrop: this.messages['createError401']['backdrop']
                //   });
                // }
            });
    }

    getPaises() {
        this.service.get('catalogos/paises').subscribe(
            response => {
                this.paises = response['paises'];

            },
            error => {


            });
    }

    getProvincias() {
        this.service.get('catalogos/provincias').subscribe(
            response => {
                this.provincias = response['provincias'];

            },
            error => {

            });
    }

    getCantones(idProvincia: number) {
        this.service.get('catalogos/cantones?provincia_id=' + idProvincia).subscribe(
            response => {
                this.cantones = response['cantones'];

            },
            error => {


            });
    }

    validateTipoIdentificacion() {
//    this.estudiante.identificacion = null;
    }

    validateCampos(): boolean {
        let flag = true;
        this.errors = new Array<string>();
        // if (this.informacionEstudiante.telefono_fijo == null
        //     || (this.informacionEstudiante.telefono_fijo == ''
        //         || this.informacionEstudiante.telefono_fijo.length !== 7)) {
        //     this.errors.push('Formato Incorrecto: Teléfono convencional');
        //     flag = false;
        // }
        if (this.informacionEstudiante.telefono_celular != null && this.informacionEstudiante.telefono_celular != ''
            && this.informacionEstudiante.telefono_celular.length !== 10) {
            this.errors.push('Formato Incorrecto: Teléfono celular');
            flag = false;
        }
        if (this.informacionEstudiante.direccion != null && this.informacionEstudiante.direccion != ''
            && this.informacionEstudiante.direccion.length < 12) {
            this.errors.push('Dirección Incompleta');
            flag = false;
        }
        if (this.informacionEstudiante.codigo_postal != null && this.informacionEstudiante.codigo_postal != ''
            && this.informacionEstudiante.codigo_postal.length !== 6) {
            this.errors.push('Formato Incorrecto: Código Postal');
            flag = false;
        }
        // if (this.informacionEstudiante.contacto_emergencia_telefono != null
        //     || (this.informacionEstudiante.contacto_emergencia_telefono.length !== 10
        //     && this.informacionEstudiante.contacto_emergencia_telefono.length !== 9)) {
        //     this.errors.push('Formato Incorrecto: Teléfono Contacto Emergencia (ej. 023456789)');
        //     flag = false;
        // }
        return flag;
    }
}
