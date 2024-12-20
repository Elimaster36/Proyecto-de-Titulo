import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./auth/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'configuration-settings',
    loadChildren: () =>
      import(
        './configuration/pages/configuration-settings/configuration-settings.module'
      ).then((m) => m.ConfigurationSettingsPageModule),
  },
  {
    path: 'background-settings',
    loadChildren: () =>
      import(
        './configuration/pages/background-settings/background-settings.module'
      ).then((m) => m.BackgroundSettingsPageModule),
  },
  {
    path: 'who-am-i',
    loadChildren: () =>
      import('./configuration/pages/who-am-i/who-am-i.module').then(
        (m) => m.WhoAmIPageModule
      ),
  },
  {
    path: 'tutorials',
    loadChildren: () =>
      import('./configuration/pages/tutorials/tutorials.module').then(
        (m) => m.TutorialsPageModule
      ),
  },
  {
    path: 'quien-soy',
    loadChildren: () =>
      import('./quien-soy/quien-soy.module').then((m) => m.QuienSoyPageModule),
  },
  {
    path: 'agenda',
    loadChildren: () =>
      import('./agenda/agenda.module').then((m) => m.AgendaPageModule),
  },  {
    path: 'noticias',
    loadChildren: () => import('./noticias/noticias.module').then( m => m.NoticiasPageModule)
  },
  {
    path: 'compartir-ubicacion',
    loadChildren: () => import('./compartir-ubicacion/compartir-ubicacion.module').then( m => m.CompartirUbicacionPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
