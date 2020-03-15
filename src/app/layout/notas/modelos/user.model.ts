import {Rol} from './rol.model';
import {Carrera} from './carrera.model';

export class User {
    id: string;
    user_name: string;
    name: string;
    email: string;
    password: string;
    estado: string;
    role: Rol;
    carreras: Array<Carrera>;

    constructor() {
        this.role = new Rol();
        this.carreras = new Array<Carrera>();
    }
}
