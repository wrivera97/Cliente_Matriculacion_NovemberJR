import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {PerfilEstudianteSecretariaRoutingModule} from './perfil-estudiante-secretaria-routing.module';
import {PerfilEstudianteSecretariaComponent} from './perfil-estudiante-secretaria.component';
import {SolicitudComponent} from './solicitud/solicitud.component';
import {FormularioComponent} from './formulario/formulario.component';


@NgModule({
  imports: [CommonModule, PerfilEstudianteSecretariaRoutingModule, NgbModule, FormsModule],
  declarations: [
    PerfilEstudianteSecretariaComponent,
    SolicitudComponent,
    FormularioComponent,
  ]
})
export class PerfilEstudianteSecretariaModule {
}
