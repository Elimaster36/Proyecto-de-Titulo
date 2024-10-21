import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WhoAmIPage } from './who-am-i.page';

const routes: Routes = [
  {
    path: '',
    component: WhoAmIPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhoAmIPageRoutingModule {}
