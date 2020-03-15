import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ServiceService} from '../../service.service';
import {Estudiante} from '../../modelos/estudiante.model';
import {Ubicacion} from '../../modelos/ubicacion.model';
import {catalogos} from '../../../../../environments/catalogos';
import {InformacionEstudiante} from '../../modelos/informacion-estudiante.model';
import {NgxSpinnerService} from 'ngx-spinner';
import swal from 'sweetalert2';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import {Matricula} from '../../modelos/matricula.model';
import {Carrera} from '../../modelos/carrera.model';
import {Instituto} from '../../modelos/instituto.model';
import {User} from '../../modelos/user.model';

@Component({
    selector: 'app-formulario',
    templateUrl: './formulario.component.html',
    styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {
    @ViewChild('encabezadoHojaVida', null) encabezadoHojaVida: ElementRef;
    @ViewChild('cuerpoHojaVida1', null) cuerpoHojaVida1: ElementRef;
    @ViewChild('pieHojaVida1', null) pieHojaVida1: ElementRef;
    @ViewChild('cuerpoHojaVida2', null) cuerpoHojaVida2: ElementRef;
    @ViewChild('pieHojaVida2', null) pieHojaVida2: ElementRef;

    constructor(private spinner: NgxSpinnerService, private service: ServiceService) {
        this.spinnerConfiguracion = catalogos.spinnerConfiguracion[0];

    }

    errors: Array<string>;
    edad: number;
    spinnerConfiguracion: any;
    matricula: Matricula;
    instituto: Instituto;
    carrera: Carrera;
    estudiante: Estudiante;
    informacionEstudiante: InformacionEstudiante;
    paisesNacionalidad: Array<Ubicacion>;
    paisesResidencia: Array<Ubicacion>;
    tiposIdentificacion: Array<any>;
    tiposInstituciones: Array<any>;
    tiposColegio: Array<any>;
    tiposBachillerato: Array<any>;
    sectoresEconomicos: Array<any>;
    alcancesVinculacion: Array<any>;
    opcionesSiNo: Array<any>;
    opcionesSiNoNA: Array<any>;
    ocupacionesEstudiante: Array<any>;
    destinosIngreso: Array<any>;
    nivelesFormacion: Array<any>;
    tiposSangre: Array<any>;
    ubicacionNacimiento: any;
    ubicacionResidencia: any;
    categoriasMigratoria: Array<any>;
    estadosCivil: Array<any>;
    tiposDiscapacidad: Array<any>;
    sexos: Array<any>;
    generos: Array<any>;
    etnias: Array<any>;
    pueblosNacionalidad: Array<any>;
    jornadas: Array<any>;
    paralelos: Array<any>;
    semestres: Array<any>;
    user: User;
    flagFormulario: boolean;

    ngOnInit() {
        this.errors = new Array<string>();
        this.user = JSON.parse(localStorage.getItem('user')) as User;
        this.flagFormulario = false;
        this.ubicacionNacimiento = '';
        this.ubicacionResidencia = '';
        this.matricula = new Matricula();
        this.instituto = new Instituto();
        this.carrera = new Carrera();
        this.informacionEstudiante = new InformacionEstudiante();
        this.jornadas = catalogos.jornadas;
        this.pueblosNacionalidad = catalogos.pueblosNacionalidad;
        this.tiposInstituciones = catalogos.tiposInstituciones;
        this.tiposColegio = catalogos.tiposColegio;
        this.etnias = catalogos.etnias;
        this.sexos = catalogos.sexos;
        this.generos = catalogos.generos;
        this.opcionesSiNo = catalogos.opcionesSiNo;
        this.opcionesSiNoNA = catalogos.opcionesSiNoNA;
        this.tiposIdentificacion = catalogos.tiposIdentificacion;
        this.ocupacionesEstudiante = catalogos.ocupacionesEstudiante;
        this.tiposBachillerato = catalogos.tiposBachillerato;
        this.sectoresEconomicos = catalogos.sectoresEconomicos;
        this.alcancesVinculacion = catalogos.alcancesVinculacion;
        this.destinosIngreso = catalogos.destinosIngreso;
        this.nivelesFormacion = catalogos.nivelesFormacion;
        this.tiposSangre = catalogos.tiposSangre;
        this.categoriasMigratoria = catalogos.categoriasMigratoria;
        this.estadosCivil = catalogos.estadosCivil;
        this.tiposDiscapacidad = catalogos.tiposDiscapacidad;
        this.semestres = catalogos.semestres;
        this.paralelos = catalogos.paralelos;
        this.getFormulario();
    }

    getFormulario() {
        this.spinner.show();
        this.service.update('matriculas/fecha_formulario', {'usuario': this.user.id}).subscribe(
            response1 => {
                this.service.get('estudiantes/formulario/' + this.user.id).subscribe(
                    response2 => {
                        this.spinner.hide();
                        this.flagFormulario = true;
                        this.matricula = response2['matricula'];
                        this.informacionEstudiante = response2['informacion_estudiante'];
                        this.instituto = response2['instituto'];
                        this.carrera = response2['carrera'];
                        this.ubicacionNacimiento = response2['ubicacion_nacimiento'][0];
                        this.ubicacionResidencia = response2['ubicacion_residencia'][0];
                        this.calculateEdad(response2['matricula']['estudiante']['fecha_nacimiento']);
                    },
                    error => {
                        this.spinner.hide();
                    });
            },
            error => {
                this.spinner.hide();
            });
    }

    getPaisesNacionalidad() {
        this.service.get('paises_nacionalidad').subscribe(
            response => {
                this.paisesNacionalidad = response['paises_nacionalidad'];
            },
            error => {
                this.spinner.hide();

            });
    }

    getPaisesResidencia() {
        this.service.get('paises_residencia').subscribe(
            response => {
                this.paisesNacionalidad = response['paises_residencia'];
            },
            error => {
                this.spinner.hide();

            });
    }

    validarPracticas() {

    }

    validarVinculacion() {
    }

    validateTituloSuperior() {
        this.informacionEstudiante.titulo_superior_obtenido = '';
    }

    validateOcupacion() {
        this.informacionEstudiante.nombre_empresa_labora = '';
        this.informacionEstudiante.area_trabajo_empresa = '';
        this.informacionEstudiante.destino_ingreso = '';
    }

    imprimir2() {
        // return xepOnline.Formatter.Format('formulario1', {
        //     render: 'download',
        //     filename: 'PDF'
        // });
    }

    imprimir() {
        if (this.validateFormulario()) {
            this.spinner.show();
            html2canvas(this.encabezadoHojaVida.nativeElement).then(canvasEncabezado => {
                const encabezadoHojaDatosImg = canvasEncabezado.toDataURL('image/png');
                html2canvas(this.cuerpoHojaVida1.nativeElement).then(canvasCuerpo1 => {
                    const cuerpoHojaDatosImg1 = canvasCuerpo1.toDataURL('image/png');
                    html2canvas(this.pieHojaVida1.nativeElement).then(canvasPie1 => {
                        const pieHojaDatosImg1 = canvasPie1.toDataURL('image/png');
                        html2canvas(this.cuerpoHojaVida2.nativeElement).then(canvasCuerpo2 => {
                            const cuerpoHojaDatosImg2 = canvasCuerpo2.toDataURL('image/png');
                            html2canvas(this.pieHojaVida2.nativeElement).then(canvasPie2 => {
                                const pieHojaDatosImg2 = canvasPie2.toDataURL('image/png');
                                const doc = new jsPDF();
                                doc.addImage(encabezadoHojaDatosImg, 'PNG', 10, 10, 190, 25);
                                doc.addImage(cuerpoHojaDatosImg1, 'PNG', 20, 40, 165, 230);
                                doc.addImage(pieHojaDatosImg1, 'PNG', 10, 280, 180, 5);
                                doc.addPage();
                                doc.addImage(encabezadoHojaDatosImg, 'PNG', 10, 10, 190, 30);
                                doc.addImage(cuerpoHojaDatosImg2, 'PNG', 20, 40, 165, 230);
                                doc.addImage(pieHojaDatosImg2, 'PNG', 10, 280, 180, 10);
                                const nombresEstudiante = this.matricula.estudiante.apellido1 + ' ' + this.matricula.estudiante.apellido2
                                    + ' ' + this.matricula.estudiante.nombre1 + ' ' + this.matricula.estudiante.nombre2;
                                doc.save('FORMULARIO-MATRICULA-' + nombresEstudiante + '-' + this.matricula.estudiante.identificacion + '.pdf');
                                // doc.autoPrint();
                                window.open(doc.output('bloburl'));
                                this.spinner.hide();
                            });
                        });
                    });
                });
            });
        } else {
            let listaErrores = '';
            for (let i = 0; i < this.errors.length; i++) {
                listaErrores += '<li>' + this.errors[i] + '</li>';
            }
            swal.fire('Verificar los siguientes campos:', listaErrores, 'error');
        }

    }

    imprimirPrueba() {
        if (true) {
            this.spinner.show();
            html2canvas(this.encabezadoHojaVida.nativeElement).then(canvasEncabezado => {
                const encabezadoHojaDatosImg = canvasEncabezado.toDataURL('image/png');
                html2canvas(this.cuerpoHojaVida1.nativeElement).then(canvasCuerpo1 => {
                    const cuerpoHojaDatosImg1 = canvasCuerpo1.toDataURL('image/png');
                    html2canvas(this.pieHojaVida1.nativeElement).then(canvasPie1 => {
                        const pieHojaDatosImg1 = canvasPie1.toDataURL('image/png');
                        html2canvas(this.cuerpoHojaVida2.nativeElement).then(canvasCuerpo2 => {
                            const cuerpoHojaDatosImg2 = canvasCuerpo2.toDataURL('image/png');
                            html2canvas(this.pieHojaVida2.nativeElement).then(canvasPie2 => {
                                const pieHojaDatosImg2 = canvasPie2.toDataURL('image/png');
                                const doc = new jsPDF();
                                doc.addImage(encabezadoHojaDatosImg, 'PNG', 10, 10, 190, 25);
                                doc.addImage(cuerpoHojaDatosImg1, 'PNG', 20, 40, 165, 230);
                                doc.addImage(pieHojaDatosImg1, 'PNG', 10, 280, 180, 5);
                                doc.addPage();
                                doc.addImage(encabezadoHojaDatosImg, 'PNG', 10, 10, 190, 30);
                                doc.addImage(cuerpoHojaDatosImg2, 'PNG', 20, 40, 165, 230);
                                doc.addImage(pieHojaDatosImg2, 'PNG', 10, 280, 180, 10);
                                const nombresEstudiante = this.matricula.estudiante.apellido1 + ' ' + this.matricula.estudiante.apellido2
                                    + ' ' + this.matricula.estudiante.nombre1 + ' ' + this.matricula.estudiante.nombre2;
                                doc.save('FORMULARIO-MATRICULA-' + nombresEstudiante + '-' + this.matricula.estudiante.identificacion + '.pdf');
                                // doc.autoPrint();
                                window.open(doc.output('bloburl'));
                                this.spinner.hide();
                            });
                        });
                    });
                });
            });
        } else {
            let listaErrores = '';
            for (let i = 0; i < this.errors.length; i++) {
                listaErrores += '<li>' + this.errors[i] + '</li>';
            }
            swal.fire('Verificar los siguientes campos:', listaErrores, 'error');
        }

    }

    calculateEdad(fechaNacimiento) {
        if (fechaNacimiento != null && fechaNacimiento !== '') {
            const fecha_nacimiento = new Date(fechaNacimiento + ' GMT-0500');
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

    validateFormulario(): boolean {
        let flag = true;
        if (this.matricula.estudiante.sexo == null || !(this.matricula.estudiante.sexo === '1' || this.matricula.estudiante.sexo === '2')) {
            this.errors.push('3. Sexo');
            flag = false;
        }
        if (this.matricula.estudiante.genero == null || !(this.matricula.estudiante.genero === '1'
            || this.matricula.estudiante.genero === '2')) {
            this.errors.push('4. Género');
            flag = false;
        }
        if (this.informacionEstudiante.telefono_celular == null || this.informacionEstudiante.telefono_celular.length !== 10) {
            this.errors.push('7. Teléfono celular (formato incorrecto)');
            flag = false;
        }
        if (this.informacionEstudiante.telefono_fijo == null || this.informacionEstudiante.telefono_fijo.length !== 9) {
            this.errors.push('8. Teléfono convencional (formato incorrecto)');
            flag = false;
        }
        if (this.informacionEstudiante.direccion != null && this.informacionEstudiante.direccion.length < 12) {
            this.errors.push('9. Dirección Incompleta');
            flag = false;
        }
        if (this.informacionEstudiante.codigo_postal != null && this.informacionEstudiante.codigo_postal.length !== 6) {
            this.errors.push('10. Código Postal');
            flag = false;
        }

        if (this.informacionEstudiante.contacto_emergencia_nombres == null ||
            this.informacionEstudiante.contacto_emergencia_nombres.length == 0) {
            this.errors.push('11. Nombres (contacto emergencia)');
            flag = false;
        }
        if (this.informacionEstudiante.contacto_emergencia_parentesco == null
            || this.informacionEstudiante.contacto_emergencia_parentesco.length == 0) {
            this.errors.push('12. Parentesco (contacto emergencia)');
            flag = false;
        }
        if (this.informacionEstudiante.contacto_emergencia_telefono == null
            || this.informacionEstudiante.contacto_emergencia_telefono == '' ||
            (this.informacionEstudiante.contacto_emergencia_telefono.length !== 10
                && this.informacionEstudiante.contacto_emergencia_telefono.length !== 9)) {
            //     && this.informacionEstudiante.contacto_emergencia_telefono.length !== 9)) {
            this.errors.push('13. Teléfono contacto emergencia (formato incorrecto)');
            flag = false;
        }
        if (this.matricula.estudiante.etnia == null || this.matricula.estudiante.etnia === '0') {
            this.errors.push('14. Etnia');
            flag = false;
        }
        console.log('this.informacionEstudiante.codigo_postal');
        console.log(this.matricula.estudiante.pueblo_nacionalidad);

        if (this.matricula.estudiante.etnia == '1') {
            if (this.matricula.estudiante.pueblo_nacionalidad === '0') {
                this.errors.push('15. Pueblo Nacionalidad');
                flag = false;
            }
        }
        if (this.informacionEstudiante.habla_idioma_ancestral === '0') {
            this.errors.push('16. Habla idioma ancestral');
            flag = false;
        }
        if (this.informacionEstudiante.habla_idioma_ancestral === '1') {
            if (this.informacionEstudiante.idioma_ancestral == null || this.informacionEstudiante.idioma_ancestral.length === 0) {
                this.errors.push('16. Falta: Especificar idioma acentral');
                flag = false;
            }
        }
        if (this.informacionEstudiante.categoria_migratoria == '6') {
            if (this.ubicacionNacimiento.canton_id == '0') {
                this.errors.push('19. País Nacionalidad');
                this.errors.push('20. Provincia Nacimiento');
                this.errors.push('21. Cantón Nacimiento');
                flag = false;
            }
        }
        if (this.ubicacionNacimiento.canton_id == '0') {
            if (this.informacionEstudiante.categoria_migratoria == '0') {
                this.errors.push('22. Categoria Migratoria');
                flag = false;
            }
        }
        if (this.ubicacionResidencia.canton_id == '0') {
            this.errors.push('23. País Residencia');
            this.errors.push('24. Provincia Residencia');
            this.errors.push('25. Cantón Residencia');
            flag = false;
        }
        if (this.matricula.estudiante.tipo_sangre === '0') {
            this.errors.push('18. Tipo Sangre');
            flag = false;
        }
        if (this.informacionEstudiante.estado_civil === '0') {
            this.errors.push('26. Estado Civil');
            flag = false;
        }
        if (this.informacionEstudiante.tiene_discapacidad === '0') {
            this.errors.push('27. Discapacidad');
            flag = false;
        }
        if (this.informacionEstudiante.tiene_discapacidad === '1') {
            if (this.informacionEstudiante.numero_carnet_conadis == null || this.informacionEstudiante.numero_carnet_conadis.length === 0) {
                this.errors.push('28. Número Carnet Conadis');
                flag = false;
            }
            if (this.informacionEstudiante.porcentaje_discapacidad == null || this.informacionEstudiante.porcentaje_discapacidad <= 0) {
                this.errors.push('29. Porcentaje Discapacidad');
                flag = false;
            }
            if (this.informacionEstudiante.tipo_discapacidad == null || this.informacionEstudiante.tipo_discapacidad == '0') {
                this.errors.push('30. Tipo Discapacidad');
                flag = false;
            }
        }
        if (this.matricula.estudiante.tipo_colegio === '0') {
            this.errors.push('31. Tipo Colegio');
            flag = false;
        }
        if (this.matricula.estudiante.tipo_bachillerato === '0') {
            this.errors.push('32. Tipo Bachillerato');
            flag = false;
        }

        if (this.matricula.estudiante.anio_graduacion == null || this.matricula.estudiante.anio_graduacion.length !== 4) {
            this.errors.push('33. Año de Graduación (formato incorrecto)');
            flag = false;
        }
        if (this.informacionEstudiante.posee_titulo_superior === '0') {
            this.errors.push('34. Posee Título Superior');
            flag = false;
        }

        if (this.informacionEstudiante.posee_titulo_superior === '1') {
            if (this.informacionEstudiante.titulo_superior_obtenido == null
                || this.informacionEstudiante.titulo_superior_obtenido.length < 10) {
                this.errors.push('34. Título Superior Obtenido');
                flag = false;
            }
        }
        if (this.informacionEstudiante.ha_realizado_practicas === '0') {
            this.errors.push('49. Ha Realizado Prácticas');
            flag = false;
        }
        if (this.informacionEstudiante.ha_realizado_practicas === '1') {
            if (this.informacionEstudiante.horas_practicas <= 0) {
                this.errors.push('50. Horas Prácticas');
                flag = false;
            }
            if (this.informacionEstudiante.tipo_institucion_practicas === '0') {
                this.errors.push('51. Tipo Institución Prácticas');
                flag = false;
            }
            if (this.informacionEstudiante.sector_economico_practica === '0') {
                this.errors.push('52. Sector Económico Prácticas');
                flag = false;
            }
            if (this.informacionEstudiante.sector_economico_practica === '22') {
                this.errors.push('53. Sector Económico Prácticas no permitido (N/A)');
                flag = false;
            }
        }
        if (this.informacionEstudiante.ha_realizado_vinculacion === '0') {
            this.errors.push('53. Ha Realizado Vinculación');
            flag = false;
        }
        if (this.informacionEstudiante.ha_realizado_vinculacion === '1') {
            // if (this.informacionEstudiante.horas_vinculacion <= 0) {
            //     this.errors.push('Falta: Horas Vinculación');
            //     flag = false;
            // }
            if (this.informacionEstudiante.alcance_vinculacion === '0') {
                this.errors.push('54. Tipo Alcance Vinculación');
                flag = false;
            }
            if (this.informacionEstudiante.alcance_vinculacion === '22') {
                this.errors.push('54 . Tipo Alcance Vinculación no permitido (N/A)');
                flag = false;
            }
        }
        if (this.informacionEstudiante.ocupacion === '0') {
            this.errors.push('55. Se Encuentra Dedicado');
            flag = false;
        }
        if (this.informacionEstudiante.ocupacion === '2') {
            if (this.informacionEstudiante.nombre_empresa_labora == null || this.informacionEstudiante.nombre_empresa_labora.length === 0) {
                this.errors.push('56. Nombre Empresa Labora');
                flag = false;
            }
            if (this.informacionEstudiante.area_trabajo_empresa === '0') {
                this.errors.push('57. Area Empresa Labora');
                flag = false;
            }
            if (this.informacionEstudiante.destino_ingreso === '0') {
                this.errors.push('58. Para Que Emplea sus ingresos');
                flag = false;
            }
        }
        if (this.informacionEstudiante.recibe_bono_desarrollo === '0') {
            this.errors.push('59. Bono de Desarrollo');
            flag = false;
        }
        if (this.informacionEstudiante.nivel_formacion_padre === '0') {
            this.errors.push('60. Nivel Formación Padre');
            flag = false;
        }
        if (this.informacionEstudiante.nivel_formacion_madre === '0') {
            this.errors.push('61. Nivel Formación Madre');
            flag = false;
        }
        if (this.informacionEstudiante.ingreso_familiar <= 1) {
            this.errors.push('62. Ingresos Familiares');
            flag = false;
        }
        if (this.informacionEstudiante.numero_miembros_hogar <= 0) {
            this.errors.push('63. Número Miembros del Hogar');
            flag = false;
        }
        return flag;
    }

    async updateFecha() {
        this.service.update('matriculas/fecha_solicitud', {'usuario': this.user.id}).subscribe(
            response => {

            },
            error => {

            });
    }
}
