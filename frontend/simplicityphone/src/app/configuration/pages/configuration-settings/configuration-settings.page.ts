import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppManagementService } from '../../services/app-management.service';

@Component({
  selector: 'app-configuration-settings',
  templateUrl: './configuration-settings.page.html',
  styleUrls: ['./configuration-settings.page.scss'],
})
export class ConfigurationSettingsPage implements OnInit {
  constructor(
    private router: Router,
    private appManagementService: AppManagementService
  ) {}

  ngOnInit() {}

  openBackgroundSettings() {
    this.router.navigate(['/background-settings']); // Navegar a la página de fondo de pantalla
  }

  openButtonSettings() {
    this.router.navigate(['/buttons-settings']); // Navegar a la página de botones
  }

  openWhoAmI() {
    this.router.navigate(['/who-am-i']); // Navegar a la página "Quien Soy"
  }

  openTutorials() {
    this.router.navigate(['/tutorials']); // Navegar a la página de tutoriales
  }

  openApplications() {
    this.appManagementService.openAppLauncher();
  }

  logout() {
    // Lógica para cerrar sesión
    console.log('Cerrando sesión');
  }
}
