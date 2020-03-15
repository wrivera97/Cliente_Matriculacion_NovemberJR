import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilEstudianteComponent } from './cupo.component';

describe('PerfilEstudianteSecretariaComponent', () => {
    let component: PerfilEstudianteComponent;
    let fixture: ComponentFixture<PerfilEstudianteComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [PerfilEstudianteComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(PerfilEstudianteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
