import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ServiceService} from '../../matriculacion/service.service';
import {PeriodoLectivo} from '../../matriculacion/modelos/periodo-lectivo.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {User} from '../../matriculacion/modelos/user.model';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public pushRightClass: string;
    public periodoLectivoActual: PeriodoLectivo;
    user: User;

    constructor(
        private spinner: NgxSpinnerService,
        private service: ServiceService,
        private translate: TranslateService,
        public router: Router
    ) {

        this.translate.addLangs(['es']);
        this.translate.setDefaultLang('es');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/es/) ? browserLang : 'en');

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.user = JSON.parse(localStorage.getItem('user')) as User;
        this.periodoLectivoActual = new PeriodoLectivo();
        // this.getPeriodoLectivoActual();
        this.pushRightClass = 'push-right';
        this.translate.setDefaultLang('es');
        this.changeLang('es');
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedin');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    getPeriodoLectivoActual() {
        this.spinner.show();
        this.service.get('periodo_lectivos/actual').subscribe(
            response => {
                this.periodoLectivoActual = response['periodo_lectivo_actual'];
                localStorage.setItem('periodoLectivoActual', JSON.stringify(this.periodoLectivoActual));
                this.spinner.hide();
            },
            error => {
                this.spinner.hide();
            });
    }




}
