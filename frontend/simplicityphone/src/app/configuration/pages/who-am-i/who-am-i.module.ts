import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WhoAmIPageRoutingModule } from './who-am-i-routing.module';

import { WhoAmIPage } from './who-am-i.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WhoAmIPageRoutingModule
  ],
  declarations: [WhoAmIPage]
})
export class WhoAmIPageModule {}
