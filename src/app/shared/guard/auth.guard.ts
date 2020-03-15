import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {User} from '../../layout/matriculacion/modelos/user.model';
import {ServiceService} from '../../layout/matriculacion/service.service';

@Injectable()
export class AuthGuard implements CanActivate {
    user: User;
    userAux: User;

    constructor(private router: Router, private service: ServiceService) {
        this.userAux = new User();
    }

    canActivate(route: ActivatedRouteSnapshot) {
        this.user = JSON.parse(localStorage.getItem('user')) as User;
        this.getUsuario();
        console.log(route['_routerState']['url']);
        if (localStorage.getItem('isLoggedin') === 'true') {
            switch (route['_routerState']['url']) {
                case '/':
                    return true;
                    break;
                case '/dashboard-matricula':
                    if (this.user.role.rol === '3' || this.user.role.rol === '4' || this.user.role.rol === '6') {
                        return true;
                    }
                    break;
                case '/dashboard-cupo':
                    if (this.user.role.rol === '1') {
                        return true;
                    }
                    break;
                case '/dashboard':
                    if (this.user.role.rol === '3' || this.user.role.rol === '4') {
                        return true;
                    }
                    break;
                case '/matricula':
                    if (this.user.role.rol === '3' || this.user.role.rol === '4') {
                        return true;
                    }
                    break;
                case '/cupos':
                    if (this.user.role.rol === '1' || this.user.role.rol === '4') {
                        return true;
                    }
                    break;
                case '/perfil-estudiante':
                    if (this.user.role.rol === '2') {
                        return true;
                    }
                    break;
                case '/usuarios':
                    if (this.user.role.rol === '5') {
                        return true;
                    }
                    break;
                case '/ajustes':
                    if (this.user.role.rol === '4') {
                        return true;
                    }
                    break;
                case '/perfil-estudiante-secretaria':
                    if (this.user.role.rol === '3' || this.user.role.rol === '4') {
                        return true;
                    }
                    break;
                case '/dashboard-docente':
                    if (this.user.role.rol === '7') {
                        return true;
                    }
                    break;
                case '/eva-estudiante-docente':
                    if (this.user.role.rol === '2') {
                        return true;
                    }
                    break;
                case '/docente-asignatura':
                    if (this.user.role.rol === '4') {
                        return true;
                    }
                    break;
                default:
                    this.router.navigate(['/access-denied']);
                    return false;
                    break;
            }
            this.router.navigate(['/access-denied']);
            return false;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }

    getUsuario() {
        if (this.user != null) {
            this.service.get('usuarios/login?email=' + this.user.email).subscribe(response => {
                this.userAux = response['usuario'];
                if (this.userAux.role.id !== this.user.role.id || this.userAux.estado === 'INACTIVO') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('isLoggedin');
                    this.router.navigate(['/login']);
                    return false;
                }
            });
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
