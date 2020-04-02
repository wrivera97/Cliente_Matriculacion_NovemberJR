import { User } from './user.model';

export class Docente {
id?: number;
nombre1: String;
nombre2: String;
apellido1: String;
apellido2: String;
identificacion: String;
genero: String;
correo_institucional: String;
estado: String;
user: User;

    constructor() {
        this.nombre1 = '';
        this.nombre2 = '';
        this.apellido1 = '';
        this.apellido2 = '';
        this.correo_institucional  = '';
        this.estado = '';
        this.genero = '';
        this.identificacion = '';
        this.user = new User();

    }
}
