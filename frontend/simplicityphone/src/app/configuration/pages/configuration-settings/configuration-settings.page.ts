import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-configuration-settings',
  templateUrl: './configuration-settings.page.html',
  styleUrls: ['./configuration-settings.page.scss'],
})
export class ConfigurationSettingsPage implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}

  openBackgroundSettings() {
    this.router.navigate(['/background-settings']); // Navegar a la página de fondo de pantalla
  }

  openWhoAmI() {
    this.router.navigate(['/who-am-i']); // Navegar a la página "Quien Soy"
  }

  openTutorials() {
    this.router.navigate(['/tutorials']); // Navegar a la página de tutoriales
  }

  logout() {
    this.authService.logout();
  }
}
