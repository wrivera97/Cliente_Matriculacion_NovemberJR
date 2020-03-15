import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {UsuarioRoutingModule} from './usuario-routing.module';
import {UsuarioComponent} from './usuario.component';
import {Seccion1Component} from './seccion1/seccion1.component';


@NgModule({
    imports: [CommonModule, UsuarioRoutingModule, NgbModule, FormsModule],
    declarations: [
        UsuarioComponent,
        Seccion1Component,
    ]
})
export class UsuarioModule {
}
