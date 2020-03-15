import {Component, OnInit} from '@angular/core';
import {Matricula} from '../modelos/matricula.model';
import {ServiceService} from '../service.service';
import swal from 'sweetalert2';
import kjua from 'kjua';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {catalogos} from '../../../../environments/catalogos';
import {InformacionEstudiante} from '../modelos/informacion-estudiante.model';
import {Estudiante} from '../modelos/estudiante.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {User} from '../modelos/user.model';

@Component({
    selector: 'app-perfil-estudiante',
    templateUrl: './perfil-estudiante.component.html',
    styleUrls: ['./perfil-estudiante.component.scss']
})
export class PerfilEstudianteComponent implements OnInit {
    flagInformacionEstudiante: boolean;
    flagSeccion1: boolean;
    flagSeccion2: boolean;
    flagSeccion3: boolean;
    errors: string;
    doc: any;
    messages: any;
    estudiante: Estudiante;
    informacionEstudiante: InformacionEstudiante;
    matricula: Matricula;
    user: User;
    tab: any;

    constructor(private spinner: NgxSpinnerService, private service: ServiceService) {
    }

    ngOnInit() {
        this.flagInformacionEstudiante = false;
        this.messages = catalogos.messages;
        this.matricula = new Matricula();
        this.estudiante = new Estudiante();
        this.getEstudiante();
    }

    getEstudiante() {
        this.spinner.show();
        this.user = JSON.parse(localStorage.getItem('user')) as User;
        this.service.get('estudiantes/' + this.user.id).subscribe(
            response => {
                this.matricula = response['matricula'];
                this.estudiante = response['estudiante'];
                this.informacionEstudiante = response['informacion_estudiante'];
                this.spinner.hide();
                if (this.matricula.estado == 'EN_PROCESO' || this.matricula.estado == 'APROBADO') {
                    this.flagSeccion1 = true;
                    this.flagSeccion2 = true;
                    this.flagSeccion3 = true;
                } else {
                    this.flagSeccion1 = false;
                    this.flagSeccion2 = false;
                    this.flagSeccion3 = false;
                }
                this.flagInformacionEstudiante = true;
            },
            error => {
                this.flagInformacionEstudiante = false;
                this.spinner.hide();
                if (error.error.errorInfo[0] === '001') {
                    swal.fire(this.messages['error001']);
                } else {
                    swal.fire(this.messages['error500']);
                }
            });
    }

    validateEstudiante(estudiante: Estudiante, informacionEstudiante: InformacionEstudiante) {
        this.errors = '';
        this.errors += '<h3>1. Datos Personales:</h3>';
        if (!estudiante.tipo_identificacion) {
            this.errors += '<li>Tipo Documento</li>';
        }
        if (!estudiante.identificacion) {
            this.errors += '<li>Identificación</li>';
        }
        if (!informacionEstudiante.categoria_migratoria) {
            this.errors += '<li>Categoria Migratoria</li>';
        }
        if (!estudiante.nombre1) {
            this.errors += '<li>Primer Nombre</li>';
        }
        if (!estudiante.apellido1) {
            this.errors += '<li>Primer Nombre</li>';
        }
        if (!estudiante.tipo_sangre) {
            this.errors += '<li>Tipo Sangre</li>';
        }
        if (!estudiante.sexo) {
            this.errors += '<li>Sexo</li>';
        }
        if (!estudiante.fecha_nacimiento) {
            this.errors += '<li>Fecha de Nacimiento</li>';
        }
        if (!estudiante.correo_institucional) {
            this.errors += '<li>Correo Institucional</li>';
        }
        if (!informacionEstudiante.codigo_postal) {
            this.errors += '<i>Código Postal</i>';
        }
        if (!informacionEstudiante.telefono_celular || !informacionEstudiante.telefono_celular) {
            this.errors += '<li>Teléfono Celular o Fijo</li>';
        }
        if (!informacionEstudiante.direccion) {
            this.errors += '<li>Dirección</li>';
        }
        if (!informacionEstudiante.estado_civil) {
            this.errors += '<li>Estado Civil</li>';
        }

        this.errors += '<hr>';
        this.errors += '<h3>2. Datos Académicos:</h3>';
        if (!estudiante.fecha_inicio_carrera) {
            this.errors += '<li>Fecha Inicio Carrera</li>';
        }
        if (!informacionEstudiante.ha_repetido_asignatura) {
            this.errors += '<li>Ha Repetido Asignaturas</li>';
        }
        if (!informacionEstudiante.ha_perdido_gratuidad) {
            this.errors += '<li>Ha Perdido la Gratuidad</li>';
        }
        if (!informacionEstudiante.ha_realizado_practicas) {
            this.errors += '<li>Ha Realizado Prácticas</li>';
        }
        if (informacionEstudiante.ha_realizado_practicas === 'SI') {
            if (!informacionEstudiante.horas_practicas) {
                this.errors += '<li>Horas Prácticas</li>';
            }
            if (!informacionEstudiante.sector_economico_practica) {
                this.errors += '<li>Sector Económico Prácticas</li>';
            }
            if (!informacionEstudiante.tipo_institucion_practicas) {
                this.errors += '<li>Tipo Institución Prácticas</li>';
            }
        }
        if (!informacionEstudiante.ha_realizado_vinculacion) {
            this.errors += '<li>Ha Realizado VInculación</li>';
        }
        if (informacionEstudiante.ha_realizado_practicas === 'SI') {
            if (!informacionEstudiante.horas_vinculacion) {
                this.errors += '<li>Horas Vinculación</li>';
            }
            if (!informacionEstudiante.alcance_vinculacion) {
                this.errors += '<li>Alcance Vinculación</li>';
            }
        }
        if (!informacionEstudiante.posee_titulo_superior) {
            this.errors += '<li>Posee Título Superior</li>';
        }
        if (!estudiante.tipo_colegio) {
            this.errors += '<li>Tipo de Colegio</li>';
        }
        if (!estudiante.tipo_bachillerato) {
            this.errors += '<li>Tipo Bachillerato</li>';
        }
        if (!estudiante.anio_graduacion) {
            this.errors += '<li>Año de Graduación del Colegio</li>';
        }

        this.errors += '<hr>';
        this.errors += '<h3>3. Datos Familiares:</h3>';
        if (!informacionEstudiante.contacto_emergencia_telefono) {
            this.errors += '<li>Contacto Emergencia Teléfono</li>';
        }
        if (!informacionEstudiante.contacto_emergencia_parentesco) {
            this.errors += '<li>Contacto Emergencia Parentesco</li>';
        }
        if (!informacionEstudiante.contacto_emergencia_nombres) {
            this.errors += '<li>Contacto Emergencia Nombres</li>';
        }
        if (!informacionEstudiante.habla_idioma_ancestral) {
            this.errors += '<li>Habla Idioma Ancestral</li>';
        }
        if (informacionEstudiante.habla_idioma_ancestral === 'SI') {
            if (!informacionEstudiante.idioma_ancestral) {
                this.errors += '<li>Idioma Ancestral</li>';
            }
        }
        if (!informacionEstudiante.ocupacion) {
            this.errors += '<li>Ocupación</li>';
        }
        if (informacionEstudiante.ocupacion === 'TRABAJA') {
            if (!informacionEstudiante.nombre_empresa_labora) {
                this.errors += '<li>Nombre de la Empresa Donde Labora</li>';
            }
        }
        if (!informacionEstudiante.destino_ingreso) {
            this.errors += '<li>Destino Ingresos</li>';
        }
        if (!informacionEstudiante.nivel_formacion_padre) {
            this.errors += '<li>Nivel Formación Padre</li>';
        }
        if (!informacionEstudiante.nivel_formacion_madre) {
            this.errors += '<li>Nivel Formación Madre</li>';
        }
        if (!informacionEstudiante.ingreso_familiar) {
            this.errors += '<li>Ingreso Familiar</li>';
        }
        if (!informacionEstudiante.numero_miembros_hogar) {
            this.errors += '<li>Número de Miembros del Hogar</li>';
        }
        if (!informacionEstudiante.tiene_discapacidad) {
            this.errors += '<li>Tiene Carnet Conadis</li>';
        }
        if (informacionEstudiante.tiene_discapacidad === '1') {
            if (!informacionEstudiante.numero_carnet_conadis) {
                this.errors += '<li>Número Carnet Conadis</li>';
            }
            if (!informacionEstudiante.tipo_discapacidad) {
                this.errors += '<li>Tipo Discapacidad</li>';
            }
            if (!informacionEstudiante.porcentaje_discapacidad) {
                this.errors += '<li>Porcentaje Discapacidad</li>';
            }
        }

        this.errors += '<hr>';
        this.errors += '<h3>4. Ubicación:</h3>';
        if (!estudiante.pais_nacionalidad) {
            this.errors += '<li>País Nacionalidad</li>';
        }
        if (!estudiante.provincia_nacimiento) {
            this.errors += '<li>Provincia Nacimiento</li>';
        }
        if (!estudiante.canton_nacimiento) {
            this.errors += '<li>Cantón Nacimiento</li>';
        }
        if (!estudiante.pais_residencia) {
            this.errors += '<li>Fecha País Residencia</li>';
        }
        if (!informacionEstudiante.provincia_residencia) {
            this.errors += '<li>Provincia Residencia</li>';
        }
        if (!informacionEstudiante.canton_residencia) {
            this.errors += '<li>Cantón Residencia</li>';
        }
        if (estudiante.etnia) {
            this.errors += '<li>Etnia</li>';
        }
        if (estudiante.etnia === 'IDÍGENA') {
            if (!estudiante.pueblo_nacionalidad) {
                this.errors += '<li>Pueblo Nacionalidad</li>';
            }
        }
    }
}
