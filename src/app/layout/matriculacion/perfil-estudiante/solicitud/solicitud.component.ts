import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ServiceService} from '../../service.service';
import {Estudiante} from '../../modelos/estudiante.model';
import {Ubicacion} from '../../modelos/ubicacion.model';
import {catalogos} from '../../../../../environments/catalogos';
import {InformacionEstudiante} from '../../modelos/informacion-estudiante.model';
import {NgxSpinnerService} from 'ngx-spinner';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import {Matricula} from '../../modelos/matricula.model';
import {Carrera} from '../../modelos/carrera.model';
import {Instituto} from '../../modelos/instituto.model';
import {User} from '../../modelos/user.model';
import kjua from 'kjua';
import 'jspdf-autotable';
import swal from 'sweetalert2';

@Component({
    selector: 'app-solicitud',
    templateUrl: './solicitud.component.html',
    styleUrls: ['./solicitud.component.scss']
})
export class SolicitudComponent implements OnInit {
    @ViewChild('encabezadoHojaVida', null) encabezadoHojaVida: ElementRef;
    @ViewChild('cuerpoHojaVida1', null) cuerpoHojaVida1: ElementRef;
    @ViewChild('pieHojaVida1', null) pieHojaVida1: ElementRef;
    @ViewChild('asignaturas', null) asignaturas: ElementRef;

    constructor(private spinner: NgxSpinnerService, private service: ServiceService) {
    }

    errors: string;
    doc: any;
    messages: any;
    matricula: any;
    detalleMatricula: Array<any>;
    instituto: Instituto;
    carrera: Carrera;
    estudiante: Estudiante;
    informacionEstudiante: InformacionEstudiante;
    user: User;
    jornadas: Array<any>;
    numerosMatricula: Array<any>;
    asignaturasImg: any;
    flagSolicitud: boolean;

    ngOnInit() {
        this.flagSolicitud = false;
        this.errors = '';
        this.user = JSON.parse(localStorage.getItem('user')) as User;
        this.messages = catalogos.messages;
        this.jornadas = catalogos.jornadas;
        this.numerosMatricula = catalogos.numerosMatricula;
        this.getAsignaturas();
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
        if (!estudiante.canton_nacimiento) {
            this.errors += '<li>Cantón Nacimiento</li>';
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

    generateSolicitudMatricula(datos: any, detalle: Array<any>) {
        if (this.errors === '') {
            if (datos['codigo']) {
                const inicioY = 60;
                const inicioX = 0;
                this.doc = new jsPDF('p', 'pt');

                const barcodeData = this.getBarcodeData(datos['codigo']);
                const logo = new Image();
                logo.src = 'assets/images/logo_instituto_' + datos['instituto_id'] + '.png';
                this.doc = new jsPDF('p', 'pt');
                this.doc.addImage(barcodeData, 'JPG', 70, 30, 80, 80);
                // Logo Benito Juarez
                if (datos['instituto_id'] === 1) {
                    this.doc.addImage(logo, 'JPG', 380, 60, logo.width, logo.height);
                }
                // Logos Gran Colombia y 24 de mayo
                if (datos['instituto_id'] === 2 || datos['instituto_id'] === 3) {
                    this.doc.addImage(logo, 'JPG', 450, 30, logo.width, logo.height);
                }
                // Logo Yavirac
                if (datos['instituto_id'] === 4) {
                    this.doc.addImage(logo, 'JPG', 425, 30, logo.width, logo.height);
                }
                this.doc.setFontSize(20);
                this.doc.setFontStyle('bold');
                this.doc.text('SOLICITUD DE MATRÍCULA', 150, inicioY + 100);
                this.doc.setFontStyle('times');
                this.doc.setFontSize(12);
                const fechaSolicitud = datos['fecha_solicitud'];

                this.doc.text('Fecha: ' + fechaSolicitud.toString().substring(0, 10), 450, 80 + inicioY);
                this.doc.text('IVAN BORJA CARRERA', 70, 130 + inicioY);
                this.doc.text(datos['carrera'], 70, 150 + inicioY);
                this.doc.text('RECTOR.-', 70, 170 + inicioY);
                const nombresEstudiante = datos['estudiante']['apellido1'] + ' ' + datos['estudiante']['apellido2'] + ' '
                    + datos['estudiante']['nombre1'] + ' ' + datos['estudiante']['nombre2'];
                const texto = 'Yo, ' + nombresEstudiante + ', con cédula de ciudadanía N° ' + datos['estudiante']['identificacion']
                    + ', hago uso de mi cupo en la carrera ' + datos['carrera'] + ', en el periodo lectivo ' + datos['periodo_lectivo']['nombre']
                    + ' con la inscripción en las siguientes asignaturas:';
                this.doc.setFontStyle('normal');
                const splitTitle = this.doc.splitTextToSize(texto, 450);
                this.doc.text(70, 195 + inicioY, splitTitle);
                const rows = [];

                /*
                for (const iterator of detalle) {
                  rows.push({
                    codigo: iterator.asignatura_codigo,
                    asignatura: iterator.asignatura,
                    horas_docente: iterator.horas_docente,
                    horas_practica: iterator.horas_practica,
                    horas_autonoma: iterator.horas_autonoma,
                    periodo: iterator.periodo
                  });
                }

                this.doc.autoTable(this.getColumns(), rows, {
                  startY: 350 + inicioY,
                  margin: {top: 205, right: 70, left: 70, bottom: 100},
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
                */


                html2canvas(this.asignaturas.nativeElement).then(canvasAsignaturas => {
                    this.asignaturasImg = canvasAsignaturas.toDataURL('image/png');
                    if (detalle.length <= 1) {
                        this.doc.text('Con sentimiento de distinguida consideración.', 70, 500);
                        this.doc.text('Atentamente,', 70, 550);
                        this.doc.text(nombresEstudiante, 70, 600);
                        this.doc.text('C.C. ' + datos['estudiante']['identificacion'], 70, 620);
                        this.doc.addImage(this.asignaturasImg, 'JPG', 60, 260 + inicioY, 500, 50);
                    } else if (detalle.length <= 3) {
                        this.doc.text('Con sentimiento de distinguida consideración.', 70, 500);
                        this.doc.text('Atentamente,', 70, 550);
                        this.doc.text(nombresEstudiante, 70, 600);
                        this.doc.text('C.C. ' + datos['estudiante']['identificacion'], 70, 620);
                        this.doc.addImage(this.asignaturasImg, 'JPG', 60, 260 + inicioY, 500, 100);
                    } else if (detalle.length <= 6) {
                        this.doc.text('Con sentimiento de distinguida consideración.', 70, 550);
                        this.doc.text('Atentamente,', 70, 600);
                        this.doc.text(nombresEstudiante, 70, 650);
                        this.doc.text('C.C. ' + datos['estudiante']['identificacion'], 70, 670);
                        this.doc.addImage(this.asignaturasImg, 'JPG', 60, 260 + inicioY, 500, 200);
                    } else if (detalle.length <= 9) {
                        this.doc.text('Con sentimiento de distinguida consideración.', 70, 600);
                        this.doc.text('Atentamente,', 70, 650);
                        this.doc.text(nombresEstudiante, 70, 700);
                        this.doc.text('C.C. ' + datos['estudiante']['identificacion'], 70, 720);
                        this.doc.addImage(this.asignaturasImg, 'JPG', 60, 260 + inicioY, 500, 250);
                    } else if (detalle.length <= 12) {
                        this.doc.text('Con sentimiento de distinguida consideración.', 70, 650);
                        this.doc.text('Atentamente,', 70, 700);
                        this.doc.text(nombresEstudiante, 70, 750);
                        this.doc.text('C.C. ' + datos['estudiante']['identificacion'], 70, 770);
                        this.doc.addImage(this.asignaturasImg, 'JPG', 60, 260 + inicioY, 500, 300);
                    } else if (detalle.length <= 15) {
                        this.doc.text('Con sentimiento de distinguida consideración.', 70, 650);
                        this.doc.text('Atentamente,', 70, 700);
                        this.doc.text(nombresEstudiante, 70, 750);
                        this.doc.text('C.C. ' + datos['estudiante']['identificacion'], 70, 770);
                        this.doc.addImage(this.asignaturasImg, 'JPG', 60, 260 + inicioY, 500, 300);
                    } else if (detalle.length <= 18) {
                        this.doc.text('Con sentimiento de distinguida consideración.', 70, 700);
                        this.doc.text('Atentamente,', 70, 730);
                        this.doc.text(nombresEstudiante, 70, 780);
                        this.doc.text('C.C. ' + datos['estudiante']['identificacion'], 70, 800);
                        this.doc.addImage(this.asignaturasImg, 'JPG', 60, 260 + inicioY, 500, 350);
                    }

                    this.doc.save('SOLICITUD-MATRICULA-' + nombresEstudiante + '-' + datos['estudiante']['identificacion'] + '.pdf');
                });

            } else {
                swal.fire('Su cupo no ha sido aprobado', 'Pida ayuda a su coordinador', 'error');
            }
        } else {
            swal.fire('Falta la siguiente información:', this.errors, 'error');
        }
    }

    getSolicitudMatricula() {
        this.service.update('matriculas/fecha_solicitud', {'usuario': this.user.id}).subscribe(
            response1 => {
                this.service.get('matriculas/solicitud_matricula?user_id=' + this.user.id).subscribe(
                    response2 => {
                        this.matricula = response2['solicitud'][0];
                        this.detalleMatricula = response2['solicitud'];

                        this.generateSolicitudMatricula(this.matricula, this.detalleMatricula);
                    },
                    error => {
                        this.spinner.hide();
                        swal.fire(this.messages['error500']);
                    });
            },
            error => {
                console.log('errrrrooo');
            });

    }

    getAsignaturas() {
        this.service.get('matriculas/solicitud_matricula?user_id=' + this.user.id).subscribe(
            response => {
                this.flagSolicitud = true;
                this.matricula = response['solicitud'][0];
                this.detalleMatricula = response['solicitud'];
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
            {title: 'H. DOCENTE', dataKey: 'horas_docente'},
            {title: 'H. PRÁCTICA', dataKey: 'horas_practica'},
            {title: 'H. AUTÓNOMA', dataKey: 'horas_autonoma'},
        ];

    }

    getheaderStyles() {
        const headerStyle = {
            fillColor: [255, 255, 255],
            textColor: 0,
            fontSize: 8
        };
        return headerStyle;
    }

    getbodyStyles() {
        const bodyStyle = {
            fillColor: [255, 255, 255],
            textColor: 0,
            fontSize: 8
        };
        return bodyStyle;
    }

    getalternateRowStyles() {
        const alternateRowStyle = {
            fillColor: [255, 255, 255],
            textColor: 0,
            fontSize: 8
        };
        return alternateRowStyle;
    }
}
