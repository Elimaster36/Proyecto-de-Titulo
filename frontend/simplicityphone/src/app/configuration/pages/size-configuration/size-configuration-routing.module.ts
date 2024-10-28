import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SizeConfigurationPage } from './size-configuration.page';

const routes: Routes = [
  {
    path: '',
    component: SizeConfigurationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SizeConfigurationPageRoutingModule {}
