import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {EvaEstudianteDocenteRoutingModule} from './eva-estudiante-docente-routing.module';
import {EvaEstudianteDocenteComponent} from './eva-estudiante-docente.component';
import {EvaluacionComponent} from './evaluacion/evaluacion.component';
import {Seccion2Component} from './seccion2/seccion2.component';
import {Seccion3Component} from './seccion3/seccion3.component';
import {SolicitudComponent} from './solicitud/solicitud.component';
import {FormularioComponent} from './formulario/formulario.component';


@NgModule({
  imports: [CommonModule, EvaEstudianteDocenteRoutingModule, NgbModule, FormsModule],
  declarations: [
    EvaEstudianteDocenteComponent,
    EvaluacionComponent,
    Seccion2Component,
    Seccion3Component,
    SolicitudComponent,
    FormularioComponent,
  ]
})
export class EvaEstudianteDocenteModule {
}
