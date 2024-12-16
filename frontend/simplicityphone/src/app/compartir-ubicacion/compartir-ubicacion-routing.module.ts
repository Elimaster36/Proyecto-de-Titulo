import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompartirUbicacionPage } from './compartir-ubicacion.page';

const routes: Routes = [
  {
    path: '',
    component: CompartirUbicacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompartirUbicacionPageRoutingModule {}
