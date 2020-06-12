import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotaAsistenciaDocenteComponent } from './nota-asistencia-docente.component';
import { NotaAsistenciaDocenteRoutingModule } from './nota-asistencia-docente-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [NotaAsistenciaDocenteComponent],
  imports: [FormsModule, CommonModule, NotaAsistenciaDocenteRoutingModule, NgbModule]
})
export class NotaAsistenciaDocenteModule { }
