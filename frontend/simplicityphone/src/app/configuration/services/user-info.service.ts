import { Injectable } from '@angular/core';
import { SupabaseStorageService } from 'src/app/core/services/supabase-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1';

  constructor(private supabase: SupabaseStorageService) {}

  // Subir archivo a Supabase Storage
  async uploadFile(file: File): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    try {
      const url = await this.supabase.uploadFile(fileName, file);
      return url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Error uploading file');
    }
  }

  // Guardar los datos del usuario en el backend
  async saveUserInfo(userInfo: {
    age: number;
    address: string;
    photoUrl: string;
  }) {
    // Llama al backend (FastAPI) para guardar los datos
    try {
      const response = await fetch(`${this.apiUrl}/user-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        throw new Error('Error saving user info');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving user info:', error);
      throw error;
    }
  }
}
