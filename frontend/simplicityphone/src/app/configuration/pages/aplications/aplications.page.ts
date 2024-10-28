import { Component, OnInit } from '@angular/core';
import { AppManagementService } from '../../services/app-management.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-aplications',
  templateUrl: './aplications.page.html',
  styleUrls: ['./aplications.page.scss'],
})
export class AplicationsPage implements OnInit {
  installedApps: any[] = [];

  constructor(
    private platform: Platform,
    private appManagementService: AppManagementService
  ) {
    this.platform
      .ready()
      .then(() => {
        this.loadInstalledApps();
      })
      .catch((error) => {
        console.error('Error al preparar la plataforma:', error);
      });
  }

  ngOnInit() {}

  loadInstalledApps() {
    this.appManagementService
      .getInstalledApps()
      .then((apps) => {
        this.installedApps = apps;
      })
      .catch((error) => {
        console.error('Error al obtener las aplicaciones instaladas:', error);
      });
  }

  openApp(packageName: string) {
    this.appManagementService
      .openApp(packageName)
      .then(() => {
        console.log('Aplicación abierta');
      })
      .catch((error) => {
        console.error('Error al abrir la aplicación:', error);
      });
  }
}
