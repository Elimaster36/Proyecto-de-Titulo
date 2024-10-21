import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AplicationsPageRoutingModule } from './aplications-routing.module';

import { AplicationsPage } from './aplications.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AplicationsPageRoutingModule
  ],
  declarations: [AplicationsPage]
})
export class AplicationsPageModule {}
