import {Matricula} from './matricula.model';
import {Ubicacion} from './ubicacion.model';

export class InformacionEstudiante {
    alcance_vinculacion: string;
    area_trabajo_empresa: string;
    canton_residencia: Ubicacion;
    categoria_migratoria: string;
    codigo_postal: string;
    contacto_emergencia_nombres: string;
    contacto_emergencia_parentesco: string;
    contacto_emergencia_telefono: string;
    destino_ingreso: string;
    direccion: string;
    estado: string;
    estado_civil: string;
    ha_perdido_gratuidad: string;
    ha_realizado_practicas: string;
    ha_realizado_vinculacion: string;
    ha_repetido_asignatura: string;
    habla_idioma_ancestral: string;
    horas_practicas: number;
    horas_vinculacion: number;
    id?: number;
    idioma_ancestral: string;
    ingreso_familiar: number;
    matricula: Matricula;
    monto_ayuda_economica: number;
    monto_beca: number;
    monto_credito_educativo: number;
    nivel_formacion_madre: string;
    nivel_formacion_padre: string;
    nombre_empresa_labora: string;
    numero_carnet_conadis: string;
    numero_miembros_hogar: number;
    ocupacion: string;
    pension_diferenciada: string;
    porcentaje_discapacidad: number;
    porciento_beca_cobertura_arancel: number;
    porciento_beca_cobertura_manutencion: number;
    posee_titulo_superior: string;
    provincia_residencia: Ubicacion;
    razon_beca: string;
    recibe_bono_desarrollo: string;
    sector_economico_practica: string;
    telefono_celular: string;
    telefono_fijo: string;
    tiene_discapacidad: string;
    tipo_beca: string;
    tipo_discapacidad: string;
    tipo_financiamiento_beca: string;
    tipo_institucion_practicas: string;
    titulo_superior_obtenido: string;

    constructor() {
        this.alcance_vinculacion = '';
        this.area_trabajo_empresa = '';
        this.canton_residencia = new Ubicacion();
        this.categoria_migratoria = '';
        this.destino_ingreso = '';
        this.direccion = '';
        this.estado_civil = '';
        this.ha_perdido_gratuidad = '';
        this.ha_realizado_practicas = '';
        this.ha_realizado_vinculacion = '';
        this.ha_repetido_asignatura = '';
        this.habla_idioma_ancestral = '';
        this.matricula = new Matricula();
        this.nivel_formacion_madre = '';
        this.nivel_formacion_padre = '';
        this.ocupacion = '';
        this.posee_titulo_superior = '';
        this.provincia_residencia = new Ubicacion();
        this.recibe_bono_desarrollo = '';
        this.sector_economico_practica = '';
        this.telefono_celular = '';
        this.telefono_fijo = '';
        this.tiene_discapacidad = '';
        this.tipo_discapacidad = '';
        this.tipo_institucion_practicas = '';
        this.titulo_superior_obtenido = '';
        this.codigo_postal = '';
        this.contacto_emergencia_telefono = '';
        this.idioma_ancestral = '';
        this.numero_carnet_conadis = '';

    }

}
