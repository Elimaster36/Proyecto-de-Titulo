import { Component } from '@angular/core';
import { UserInfoService } from '../../services/user-info.service';
@Component({
  selector: 'app-who-am-i',
  templateUrl: './who-am-i.page.html',
  styleUrls: ['./who-am-i.page.scss'],
})
export class WhoAmIPage {
  age!: number;
  address!: string;
  file!: File;
  photoUrl!: string;

  constructor(private userInfoService: UserInfoService) {}

  // Función para manejar el archivo subido por el usuario
  onFileChange(event: Event) {
    // Especificar el tipo correcto para el 'target' del evento
    const input = event.target as HTMLInputElement;

    if (input?.files?.[0]) {
      this.file = input.files[0]; // Asignar el archivo
    }
  }

  // Función para enviar la información del usuario
  async onSubmit() {
    try {
      // Subir la foto a Supabase y obtener la URL pública
      const photoUrl = await this.userInfoService.uploadFile(this.file);

      // Enviar los datos al backend, incluyendo la URL de la foto
      this.userInfoService.saveUserInfo({
        age: this.age,
        address: this.address,
        photoUrl: photoUrl,
      });

      console.log('Datos guardados correctamente');
    } catch (error) {
      console.error('Error al guardar la información:', error);
    }
  }
}
