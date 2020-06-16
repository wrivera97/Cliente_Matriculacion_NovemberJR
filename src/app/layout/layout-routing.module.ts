import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {AuthGuard} from '../shared/guard';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard-matricula',
                loadChildren: () =>
                    import('./matriculacion/matricula/dashboard/dashboard-matricula.module')
                        .then(m => m.DashboardMatriculaModule), canActivate: [AuthGuard]
            },
            {
                path: 'dashboard-cupo',
                loadChildren: () => import('./matriculacion/cupo/dashboard/dashboard-cupo.module').then(m => m.DashboardCupoModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'perfil-estudiante',
                loadChildren: () => import('./matriculacion/perfil-estudiante/perfil-estudiante.module')
                    .then(m => m.PerfilEstudianteModule), canActivate: [AuthGuard]
            },
            {
                path: 'matricula',
                loadChildren: () => import('./matriculacion/matricula/matricula.module').then(m => m.MatriculaModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'cupos',
                loadChildren: () => import('./matriculacion/cupo/cupo.module').then(m => m.CupoModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'ajustes',
                loadChildren: () => import('./matriculacion/ajuste/ajuste.module').then(m => m.AjusteModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'usuarios',
                loadChildren: () => import('./matriculacion/usuario/usuario.module').then(m => m.UsuarioModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'perfil-estudiante-secretaria',
                loadChildren: () => import('./matriculacion/perfil-estudiante-secretaria/perfil-estudiante-secretaria.module')
                    .then(m => m.PerfilEstudianteSecretariaModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'dashboard-docente',
                loadChildren: () =>
                    import('./matriculacion/matricula/dashboard/dashboard-matricula.module')
                        .then(m => m.DashboardMatriculaModule), canActivate: [AuthGuard]
            },
            {
                path: 'eva-estudiante-docente',
                loadChildren: () =>
                    import('./matriculacion/eva-estudiante-docente/eva-estudiante-docente.module')
                        .then(m => m.EvaEstudianteDocenteModule), canActivate: [AuthGuard]
            },
            {
                path: 'docente-asignatura',
                loadChildren: () =>
        import('./notas/docente-asignatura/docente-asignatura.module')
        .then(n => n.DocenteAsignaturaModule), canActivate: [AuthGuard]
            },
            {
                path: 'nota-asistencia-docente',
                loadChildren: () =>
                    import('./notas/nota-asistencia-docente/nota-asistencia-docente.module')
                        .then(n => n.NotaAsistenciaDocenteModule), canActivate: [AuthGuard]
            },
            {
                 path: 'nota-asistencia-estudiante',
                 loadChildren: () =>
                    import('./notas/nota-asistencia-estudiante/nota-asistencia-estudiante.module')
                        .then(n => n.NotaAsistenciaEstudianteModule), canActivate: [AuthGuard]

            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {
}
