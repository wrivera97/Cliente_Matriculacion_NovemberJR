import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {DocenteAsignaturaRoutingModule} from './docente-asignatura-routing.module';
import {DocenteAsignaturaComponent} from './docente-asignatura.component';


@NgModule({
    imports: [FormsModule, CommonModule, DocenteAsignaturaRoutingModule, NgbModule],
    declarations: [DocenteAsignaturaComponent]
})
export class DocenteAsignaturaModule {
}
