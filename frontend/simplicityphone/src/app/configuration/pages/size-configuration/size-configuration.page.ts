import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { Preferences } from 'src/app/models/preferences';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-size-configuration',
  templateUrl: './size-configuration.page.html',
  styleUrls: ['./size-configuration.page.scss'],
})
export class SizeConfigurationPage implements OnInit {
  fontSize: number = 16;
  buttonSize: number = 16;
  userId: string | null = null; // ID del usuario actual

  preferences: Preferences = { fontSize: 16, buttonSize: 16 };

  constructor(
    private http: HttpClient,
    private firebaseService: FirebaseService
  ) {
    // Cargar las preferencias al iniciar la página (si existen)
    this.loadPreferences();
  }

  ngOnInit() {}

  loadUser() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userId = user.uid; // Obtener el ID del usuario
        this.loadPreferences(); // Cargar preferencias si el usuario está autenticado
      } else {
        console.error('No hay un usuario autenticado.');
      }
    });
  }

  loadPreferences() {
    if (!this.userId) return; // Asegúrate de que el ID de usuario esté disponible

    this.http
      .get<any>(`https://127.0.0.1:8000/api/preferences/${this.userId}`)
      .subscribe(
        (response) => {
          if (response) {
            this.fontSize = response.fontSize || 16; // Establecer un valor por defecto si no existe
            this.buttonSize = response.buttonSize || 16; // Establecer un valor por defecto si no existe
          }
        },
        (error) => {
          console.error('Error al cargar las preferencias', error);
        }
      );
  }

  updatePreferences() {
    if (!this.userId) return; // Asegúrate de que el ID de usuario esté disponible

    const preferences = {
      fontSize: this.fontSize,
      buttonSize: this.buttonSize,
    };

    this.http
      .post(
        `https://127.0.0.1:8000/api/preferences/${this.userId}`,
        preferences
      )
      .subscribe(
        (response) => {
          console.log('Preferencias guardadas exitosamente', response);
        },
        (error) => {
          console.error('Error al guardar las preferencias', error);
        }
      );
  }

  async saveChanges() {
    try {
      await this.firebaseService.saveUserPreferences(this.preferences); // Llama al servicio para guardar preferencias
      console.log('Preferencias guardadas exitosamente');
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
    }
  }
}
