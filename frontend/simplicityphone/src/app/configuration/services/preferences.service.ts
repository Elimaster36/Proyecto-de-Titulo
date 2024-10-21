import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1';
  constructor(private http: HttpClient, private authService: AuthService) {}

  // Obtener las preferencias del usuario
  async getUISettings() {
    const token = await this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/settings`, { headers }).pipe(
      catchError((error) => {
        return throwError(() => new Error(error));
      })
    );
  }

  // Crear o actualizar configuraciones de la interfaz
  async updateUISettings(
    fontSize: number,
    buttonHeight: number,
    iconSize: number
  ) {
    const token = await this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const payload = {
      font_size: fontSize,
      button_height: buttonHeight,
      icon_size: iconSize,
    };

    return this.http.put(`${this.apiUrl}/settings`, payload, { headers }).pipe(
      catchError((error) => {
        return throwError(() => new Error(error));
      })
    );
  }
}
