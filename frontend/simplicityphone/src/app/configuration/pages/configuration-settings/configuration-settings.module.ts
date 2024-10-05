import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigurationSettingsPageRoutingModule } from './configuration-settings-routing.module';

import { ConfigurationSettingsPage } from './configuration-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigurationSettingsPageRoutingModule
  ],
  declarations: [ConfigurationSettingsPage]
})
export class ConfigurationSettingsPageModule {}
