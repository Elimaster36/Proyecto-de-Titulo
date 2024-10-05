import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackgroundSettingsPageRoutingModule } from './background-settings-routing.module';

import { BackgroundSettingsPage } from './background-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackgroundSettingsPageRoutingModule
  ],
  declarations: [BackgroundSettingsPage]
})
export class BackgroundSettingsPageModule {}
