import {Component, OnInit} from '@angular/core';
import {ServiceService} from '../../service.service';
import {Estudiante} from '../../modelos/estudiante.model';
import {Ubicacion} from '../../modelos/ubicacion.model';
import {catalogos} from '../../../../../environments/catalogos';
import {InformacionEstudiante} from '../../modelos/informacion-estudiante.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {Instituto} from '../../modelos/instituto.model';
import {Carrera} from '../../modelos/carrera.model';
import {UbicacionNacimiento} from '../../modelos/ubicacionNacimiento.model';
import {UbicacionResidencia} from '../../modelos/ubicacionResidencia.model';
import {User} from '../../modelos/user.model';

@Component({
    selector: 'app-seccion2',
    templateUrl: './seccion2.component.html',
    styleUrls: ['./seccion2.component.scss']
})
export class Seccion2Component implements OnInit {
    constructor(private spinner: NgxSpinnerService, private service: ServiceService) {
    }

    ubicacionNacimiento: UbicacionNacimiento;
    ubicacionResidencia: UbicacionResidencia;
    estadoDatos: string;
    instituto: Instituto;
    carrera: Carrera;
    edad: number;
    estudiante: Estudiante;
    informacionEstudiante: InformacionEstudiante;
    paises: Array<Ubicacion>;
    provincias: Array<Ubicacion>;
    cantonesResidencia: Array<Ubicacion>;
    cantonesNacimiento: Array<Ubicacion>;
    sexos: Array<any>;
    opcionesSiNo: Array<any>;
    pueblosNacionalidad: Array<any>;
    etnias: Array<any>;
    estadosCivil: Array<any>;
    tiposSangre: Array<any>;
    tiposDiscapacidad: Array<any>;
    categoriasMigratoria: Array<any>;
    user: User;

    ngOnInit() {
        this.user = JSON.parse(localStorage.getItem('user')) as User;
        this.estadoDatos = '';
        this.ubicacionResidencia = new UbicacionResidencia();
        this.ubicacionNacimiento = new UbicacionNacimiento();
        this.paises = new Array<Ubicacion>();
        this.provincias = new Array<Ubicacion>();
        this.estudiante = new Estudiante();
        this.informacionEstudiante = new InformacionEstudiante();
        this.sexos = catalogos.sexos;
        this.estadosCivil = catalogos.estadosCivil;
        this.tiposSangre = catalogos.tiposSangre;
        this.etnias = catalogos.etnias;
        this.opcionesSiNo = catalogos.opcionesSiNo;
        this.tiposDiscapacidad = catalogos.tiposDiscapacidad;
        this.pueblosNacionalidad = catalogos.pueblosNacionalidad;
        this.categoriasMigratoria = catalogos.categoriasMigratoria;
        this.getEstudianteLoad();
        this.getPaises();
        this.getProvincias();
    }

    updateEstudiante(): void {
        if (this.estudiante.canton_nacimiento.id === 0) {
            this.estudiante.canton_nacimiento.id = Number(this.ubicacionNacimiento.pais_id);
        }

        if (this.informacionEstudiante.canton_residencia.id === 0) {
            this.informacionEstudiante.canton_residencia.id = Number(this.ubicacionResidencia.pais_id);
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
    }

    getEstudianteLoad() {
        this.spinner.show();
        this.service.get('estudiantes/' + this.user.id).subscribe(
            response => {
                this.estudiante = response['estudiante'];
                this.informacionEstudiante = response['informacion_estudiante'];
                this.ubicacionNacimiento = response['ubicacion_nacimiento'][0];
                this.ubicacionResidencia = response['ubicacion_residencia'][0];

                if (this.ubicacionResidencia) {
                    this.getCantonesResidencia(this.ubicacionResidencia.provincia_id);
                } else {
                    this.ubicacionResidencia = new UbicacionResidencia();
                    console.log(this.ubicacionResidencia);
                }

                if (this.ubicacionNacimiento) {
                    this.getCantonesNacimiento(this.ubicacionNacimiento.provincia_id);
                } else {
                    this.ubicacionNacimiento = new UbicacionNacimiento();
                    console.log(this.ubicacionResidencia);
                }
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
        // this.spinner.show();
        this.estadoDatos = 'Guardando...';
        this.service.get('estudiantes/' + this.user.id).subscribe(
            response => {
                this.estudiante = response['estudiante'];
                this.informacionEstudiante = response['informacion_estudiante'];
                this.ubicacionNacimiento = response['ubicacion_nacimiento'][0];
                this.ubicacionResidencia = response['ubicacion_residencia'][0];


                if (this.ubicacionResidencia) {
                    this.getCantonesResidencia(this.ubicacionResidencia.provincia_id);
                } else {
                    this.ubicacionResidencia = new UbicacionResidencia();
                    console.log(this.ubicacionResidencia);
                }

                if (this.ubicacionNacimiento) {
                    this.getCantonesNacimiento(this.ubicacionNacimiento.provincia_id);
                } else {
                    this.ubicacionNacimiento = new UbicacionNacimiento();
                    console.log(this.ubicacionResidencia);
                }
                // this.spinner.hide();
                this.estadoDatos = '';
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
                this.spinner.hide();

            });
    }

    getProvincias() {
        this.service.get('catalogos/provincias').subscribe(
            response => {
                this.provincias = response['provincias'];
            },
            error => {
                this.spinner.hide();

            });
    }

    getCantonesResidencia(idProvincia: string) {
        this.service.get('catalogos/cantones?provincia_id=' + idProvincia).subscribe(
            response => {
                this.cantonesResidencia = response['cantones'];
            },
            error => {
                this.spinner.hide();

            });
    }

    getCantonesNacimiento(idProvincia: string) {
        this.service.get('catalogos/cantones?provincia_id=' + idProvincia).subscribe(
            response => {
                this.cantonesNacimiento = response['cantones'];
            },
            error => {

            });
    }

    validateDiscapacidad() {
        if (this.informacionEstudiante.tiene_discapacidad === '2') {
            this.informacionEstudiante.tipo_discapacidad = '7';
        } else {
            this.informacionEstudiante.numero_carnet_conadis = '';
            this.informacionEstudiante.tipo_discapacidad = '0';
            this.informacionEstudiante.porcentaje_discapacidad = null;
        }

    }

    calculateEdad() {
        if (this.estudiante.fecha_nacimiento != null && this.estudiante.fecha_nacimiento.toString() !== '') {
            const fecha_nacimiento = new Date(this.estudiante.fecha_nacimiento.toString() + ' GMT-0500');
            const ano = fecha_nacimiento.getFullYear();
            const mes = fecha_nacimiento.getMonth();
            const dia = fecha_nacimiento.getDay();
            const fecha_hoy = new Date();
            const ahora_ano = fecha_hoy.getFullYear();
            const ahora_mes = fecha_hoy.getMonth();
            const ahora_dia = fecha_hoy.getDate();
            let edad = (ahora_ano + 1900) - ano;

            if (ahora_mes < (mes - 1)) {
                edad--;
            }
            if (((mes - 1) === ahora_mes) && (ahora_dia < dia)) {
                edad--;
            }
            if (edad > 1900) {
                edad -= 1900;
            }

            this.edad = edad;
        }
    }

    validateEtnia() {
        if (this.estudiante.etnia === '0' || this.estudiante.etnia === '1' || this.estudiante.etnia === '8') {
            this.estudiante.pueblo_nacionalidad = '0';
        } else {
            this.estudiante.pueblo_nacionalidad = '34';
        }
    }

    validateIdiomaAncestral() {
        this.informacionEstudiante.idioma_ancestral = '';
    }

    validatePaisNacionalidad() {
        if (this.ubicacionNacimiento.pais_id === '1') {
            this.ubicacionNacimiento.provincia_id = '0';
            this.estudiante.canton_nacimiento.id = 0;
            this.informacionEstudiante.categoria_migratoria = '6';
        } else {
            this.ubicacionNacimiento.provincia_id = '0';
            this.estudiante.canton_nacimiento.id = 0;
            this.informacionEstudiante.categoria_migratoria = '0';
        }

    }

    validatePaisResidencia() {
        this.ubicacionResidencia.provincia_id = '0';
        this.informacionEstudiante.canton_residencia = new Ubicacion();
    }
}
