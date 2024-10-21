import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { EmergencyButtonComponent } from '../components/emergency-button/emergency-button.component';
import { CallButtonComponent } from '../components/call-button/call-button.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [HomePage, CallButtonComponent, EmergencyButtonComponent],
})
export class HomePageModule {}
