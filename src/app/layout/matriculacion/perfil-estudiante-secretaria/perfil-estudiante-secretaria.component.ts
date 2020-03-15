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
    selector: 'app-perfil-estudiante-secretaria',
    templateUrl: './perfil-estudiante-secretaria.component.html',
    styleUrls: ['./perfil-estudiante-secretaria.component.scss']
})
export class PerfilEstudianteSecretariaComponent implements OnInit {
    flagFormulario: boolean;

    constructor(private spinner: NgxSpinnerService, private service: ServiceService) {
    }

    ngOnInit() {
        this.flagFormulario = false;
    }
}
