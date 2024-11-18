import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vyzyrqihzoexrphxjvjj.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5enlycWloem9leHJwaHhqdmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0NjU5NTcsImV4cCI6MjA0MzA0MTk1N30.aNwDU5L-7orBrEKf1jobBxdTB8sgQd599VdHQdjV9iU';

@Injectable({
  providedIn: 'root',
})
export class SupabaseStorageService {
  supabase = createClient(supabaseUrl, supabaseKey);

  // Subir archivo a Supabase Storage
  async uploadFile(fileName: string, file: File): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from('user-photos') // Asegúrate de que el nombre del bucket sea el correcto
      .upload(fileName, file);

    if (error) {
      throw new Error(error.message);
    }

    // Obtener la URL pública del archivo
    const { data: urlData } = this.supabase.storage
      .from('user-photos')
      .getPublicUrl(data.path);

    if (!urlData?.publicUrl) {
      throw new Error('Error getting public URL');
    }

    return urlData.publicUrl;
  }
}
