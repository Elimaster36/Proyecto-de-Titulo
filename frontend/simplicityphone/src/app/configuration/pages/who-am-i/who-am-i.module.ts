import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WhoAmIPageRoutingModule } from './who-am-i-routing.module';
import { WhoAmIPage } from './who-am-i.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WhoAmIPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [WhoAmIPage],
})
export class WhoAmIPageModule {}
