declare var cordova: any;
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppManagementService {
  constructor() {}
  getInstalledApps(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Usa el plugin para obtener la lista de aplicaciones
      cordova.plugins.appLauncher.getInstalledApps(
        (apps: any) => {
          resolve(apps);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  openApp(packageName: string): void {
    // Usa el plugin para abrir la aplicación
    cordova.plugins.appLauncher.launch(
      packageName,
      (success: any) => {
        console.log('Aplicación abierta', success);
      },
      (error: any) => {
        console.error('Error al abrir la aplicación', error);
      }
    );
  }
}
