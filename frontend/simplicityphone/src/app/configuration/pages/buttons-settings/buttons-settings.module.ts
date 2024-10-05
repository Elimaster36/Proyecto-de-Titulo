import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ButtonsSettingsPageRoutingModule } from './buttons-settings-routing.module';

import { ButtonsSettingsPage } from './buttons-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ButtonsSettingsPageRoutingModule
  ],
  declarations: [ButtonsSettingsPage]
})
export class ButtonsSettingsPageModule {}
