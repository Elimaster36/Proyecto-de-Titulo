import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserRoutingModule } from './user-routing.module';
import { QuienSoyPage } from './quien-soy/quien-soy.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [QuienSoyPage],
})
export class UserModule {}
