import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SizeConfigurationPageRoutingModule } from './size-configuration-routing.module';
import { SizeConfigurationPage } from './size-configuration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SizeConfigurationPageRoutingModule,
  ],
  declarations: [SizeConfigurationPage],
})
export class SizeConfigurationPageModule {}
