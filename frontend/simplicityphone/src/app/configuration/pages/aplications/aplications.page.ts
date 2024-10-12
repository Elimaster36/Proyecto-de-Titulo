import { Component, OnInit } from '@angular/core';
import { AppManagementService } from '../../services/app-management.service';

@Component({
  selector: 'app-aplications',
  templateUrl: './aplications.page.html',
  styleUrls: ['./aplications.page.scss'],
})
export class AplicationsPage implements OnInit {
  installedApps: any[] = [];

  constructor(private appManagementService: AppManagementService) {}

  ngOnInit() {
    this.loadInstalledApps();
  }

  loadInstalledApps() {
    this.appManagementService
      .getInstalledApps()
      .then((apps: any) => {
        this.installedApps = apps;
      })
      .catch((error) => {
        console.error('Error al obtener aplicaciones instaladas', error);
      });
  }

  openApp(packageName: string) {
    this.appManagementService.openApp(packageName);
  }
}
