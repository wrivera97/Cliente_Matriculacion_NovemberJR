import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotaAsistenciaComponent } from './nota-asistencia.component';
import { NotaAsistenciaRoutingModule } from './nota-asistencia-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [NotaAsistenciaComponent],
  imports: [FormsModule, CommonModule, NotaAsistenciaRoutingModule, NgbModule]
})
export class NotaAsistenciaModule { }
