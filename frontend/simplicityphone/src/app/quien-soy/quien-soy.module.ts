import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QuienSoyPageRoutingModule } from './quien-soy-routing.module';
import { QuienSoyPage } from './quien-soy.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuienSoyPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [QuienSoyPage],
})
export class QuienSoyPageModule {}
