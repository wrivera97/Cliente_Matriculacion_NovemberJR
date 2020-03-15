import {Component, OnInit} from '@angular/core';
import 'jspdf-autotable';
import {NgxSpinnerService} from 'ngx-spinner';

import {ServiceService} from '../service.service';
import {User} from '../modelos/user.model';

@Component({
    selector: 'app-perfil-estudiante',
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
    errors: string;
    messages: any;
    user: User;

    constructor(private spinner: NgxSpinnerService, private service: ServiceService) {
    }

    ngOnInit() {
    }

}
