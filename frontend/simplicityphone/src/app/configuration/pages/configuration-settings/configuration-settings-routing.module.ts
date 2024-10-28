import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigurationSettingsPage } from './configuration-settings.page';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationSettingsPageRoutingModule {}
