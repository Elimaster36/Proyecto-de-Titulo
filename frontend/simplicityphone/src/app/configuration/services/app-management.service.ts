import { Injectable } from '@angular/core';
import {
  AppLauncher,
  AppLauncherOptions,
} from '@ionic-native/app-launcher/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AppManagementService {
  constructor(private appLauncher: AppLauncher, private platform: Platform) {}

  openAppLauncher() {
    if (this.platform.is('android')) {
      try {
        // Intent para abrir el lanzador de aplicaciones en Android
        const options: AppLauncherOptions = {
          packageName: 'com.android.launcher', // Esto es el lanzador por defecto de Android
        };

        this.appLauncher.launch(options).then(
          () => {
            console.log('Lanzador de aplicaciones abierto');
          },
          (err) => {
            console.error('Error abriendo el lanzador de aplicaciones', err);
          }
        );
      } catch (error) {
        console.error('Error ejecutando el lanzador de aplicaciones', error);
      }
    } else {
      console.log('Plataforma no compatible');
    }
  }
}
