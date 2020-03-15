import {User} from './user.model';
export class Docente {

id?: number;
user_id: User;
nombre1: String;
nombre2: String;
apellido1: String;
apellido2: String;
tipo_identificacion: String;
identificacion: String;
genero: String;
fecha_nacimiento: String;
correo_personal: String;
correo_institucional: String;
tipo_sangre: String;
direccion: String;
etnia: String;
estado: String;

    constructor() {
        this.user_id = new User();
        this.nombre1 = '';
        this.nombre2 = '';
        this.apellido1 = '';
        this.apellido2 = '';
        this.correo_institucional  = '';
        this.correo_personal = '';
        this.direccion = '';
        this.estado = '';
        this.etnia = '';
        this.fecha_nacimiento  = '';
        this.genero = '';
        this.identificacion = '';
        this.tipo_identificacion = '';
        this.tipo_sangre = '';
    }
}
