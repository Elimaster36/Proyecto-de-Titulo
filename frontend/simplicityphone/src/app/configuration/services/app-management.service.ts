import { Injectable } from '@angular/core';
declare var cordova: any;
@Injectable({
  providedIn: 'root',
})
export class AppManagementService {
  installedApps: any[] = [];

  constructor() {}

  getInstalledApps(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (cordova && cordova.plugins && cordova.plugins.appInfo) {
        cordova.plugins.appInfo.getInstalledApps(
          (apps: any[]) => {
            resolve(apps);
          },
          (error: any) => {
            reject(error);
          }
        );
      } else {
        reject(
          'Cordova no está disponible o el plugin appInfo no está instalado correctamente.'
        );
      }
    });
  }

  openApp(packageName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (cordova && cordova.plugins && cordova.plugins.appInfo) {
        cordova.plugins.appInfo.startApp(
          packageName,
          (success: any) => {
            resolve(success);
          },
          (error: any) => {
            reject(error);
          }
        );
      } else {
        reject(
          'Cordova no está disponible o el plugin appInfo no está instalado correctamente.'
        );
      }
    });
  }
}
