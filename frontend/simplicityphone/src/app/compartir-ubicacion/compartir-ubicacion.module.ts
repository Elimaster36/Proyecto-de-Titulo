import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompartirUbicacionPageRoutingModule } from './compartir-ubicacion-routing.module';

import { CompartirUbicacionPage } from './compartir-ubicacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompartirUbicacionPageRoutingModule
  ],
  declarations: [CompartirUbicacionPage]
})
export class CompartirUbicacionPageModule {}
