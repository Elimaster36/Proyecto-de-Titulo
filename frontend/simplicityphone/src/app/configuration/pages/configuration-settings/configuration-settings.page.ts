import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration-settings',
  templateUrl: './configuration-settings.page.html',
  styleUrls: ['./configuration-settings.page.scss'],
})
export class ConfigurationSettingsPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  openBackgroundSettings() {
    this.router.navigate(['/background-settings']); // Navegar a la página de fondo de pantalla
  }

  openAplicationsSettings() {
    this.router.navigate(['/aplications']); // Navegar a la página de botones
  }

  openSizeConfiguration() {
    this.router.navigate(['/size-configuration']); // Navegar a la página de configuracion de tamaño
  }

  openWhoAmI() {
    this.router.navigate(['/who-am-i']); // Navegar a la página "Quien Soy"
  }

  openTutorials() {
    this.router.navigate(['/tutorials']); // Navegar a la página de tutoriales
  }

  logout() {
    // Lógica para cerrar sesión
    console.log('Cerrando sesión');
  }
}
