import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {AjusteRoutingModule} from './ajuste-routing.module';
import {AjusteComponent} from './ajuste.component';
import {Seccion1Component} from './seccion1/seccion1.component';


@NgModule({
    imports: [CommonModule, AjusteRoutingModule, NgbModule, FormsModule],
    declarations: [
        AjusteComponent,
        Seccion1Component,
    ]
})
export class AjusteModule {
}
