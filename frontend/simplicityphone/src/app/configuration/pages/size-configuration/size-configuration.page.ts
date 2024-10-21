import { Component, OnInit } from '@angular/core';
import { PreferencesService } from '../../services/preferences.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-size-configuration',
  templateUrl: './size-configuration.page.html',
  styleUrls: ['./size-configuration.page.scss'],
})
export class SizeConfigurationPage implements OnInit {
  // El ID del usuario, que puede provenir de Firebase o del estado actual del usuario
  fontSize: number = 16;
  buttonHeight: number = 40;
  iconSize: number = 24;

  constructor(private preferencesService: PreferencesService) {}

  ngOnInit() {
    this.loadSettings();
    this.updateCSSVariables();
  }

  // Cargar las configuraciones existentes
  async loadSettings() {
    try {
      const settings: any = await firstValueFrom(
        await this.preferencesService.getUISettings()
      );
      this.fontSize = settings.font_size;
      this.buttonHeight = settings.button_height;
      this.iconSize = settings.icon_size;
    } catch (error) {
      console.error('Error al cargar las configuraciones:', error);
    }
  }

  // Guardar las configuraciones
  async saveSettings() {
    try {
      await firstValueFrom(
        await this.preferencesService.updateUISettings(
          this.fontSize,
          this.buttonHeight,
          this.iconSize
        )
      )
        .then(() => this.updateCSSVariables())
        .catch((error) =>
          console.error('Error al actualizar las configuraciones:', error)
        );
      console.log('Configuraciones actualizadas correctamente');
    } catch (error) {
      console.error('Error al actualizar las configuraciones:', error);
    }
  }
  updateCSSVariables() {
    document.documentElement.style.setProperty(
      '--font-size',
      `${this.fontSize}px`
    );
    document.documentElement.style.setProperty(
      '--button-height',
      `${this.buttonHeight}px`
    );
    document.documentElement.style.setProperty(
      '--icon-size',
      `${this.iconSize}px`
    );
  }
}
