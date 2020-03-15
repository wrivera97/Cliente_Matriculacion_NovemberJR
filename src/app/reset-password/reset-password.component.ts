import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import {NgxSpinnerService} from 'ngx-spinner';
import {ServiceService} from '../layout/matriculacion/service.service';
import {User} from '../layout/matriculacion/modelos/user.model';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    password: string;
    repeatPassword: string;
    user: User;

    constructor(private router: Router, private service: ServiceService, private spinner: NgxSpinnerService,) {
    }

    ngOnInit() {
        this.user = JSON.parse(localStorage.getItem('user')) as User;
    }

    resetPassword() {
        if (this.validatePasswords()) {
            this.spinner.show();
            this.service.update('users/reset_password', {'user': this.user})
                .subscribe(
                    response => {
                        this.spinner.hide();
                        this.redirect(response['role_id']);
                    },
                    error => {
                        this.spinner.hide();
                    });
        } else {
            swal.fire('Las contraseñas no coinciden', '', 'error');
        }
    }

    validatePasswords(): boolean {
        if (this.user.password !== this.repeatPassword) {
            return false;
        }
        return true;
    }

    redirect(rol) {
        if (rol == '1') {
            this.router.navigate(['cupos']);
        }
        if (rol == '2') {
            this.router.navigate(['perfil-estudiante']);
        }
        if (rol == '3') {
            this.router.navigate(['dashboard-matricula']);
        }

        if (rol == '4') {
            this.router.navigate(['dashboard-matricula']);
        }
        if (rol == '5') {
            this.router.navigate(['usuarios']);
        }
        if (rol == '6') {
            this.router.navigate(['dashboard-matricula']);
        }
    }
}
