import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SizeConfigurationPageRoutingModule } from './size-configuration-routing.module';
import { SizeConfigurationPage } from './size-configuration.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SizeConfigurationPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [SizeConfigurationPage],
})
export class SizeConfigurationPageModule {}
