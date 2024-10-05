import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ButtonsSettingsPage } from './buttons-settings.page';

const routes: Routes = [
  {
    path: '',
    component: ButtonsSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ButtonsSettingsPageRoutingModule {}
