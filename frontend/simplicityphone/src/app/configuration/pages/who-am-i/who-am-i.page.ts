import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserInfoService } from '../../services/user-info.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-who-am-i',
  templateUrl: './who-am-i.page.html',
  styleUrls: ['./who-am-i.page.scss'],
})
export class WhoAmIPage implements OnInit {
  name: string = ''; // Para mostrar el nombre del usuario
  age: number = 0;
  address: string = '';

  constructor(
    private userInfoService: UserInfoService,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    const userId = this.authService.getUserId();
    this.userInfoService.getUserInfo(userId).subscribe({
      next: (response) => {
        this.name = response.name; // Aquí cargamos el nombre del usuario
        this.age = response.age || 0; // Si no hay edad, la dejamos en 0
        this.address = response.address || ''; // Si no hay dirección, la dejamos vacía
      },
      error: (error) => {
        console.error('Error al cargar la información del usuario:', error);
      },
    });
  }

  async onSubmit() {
    const userId = 1; // Aquí deberías obtener el ID del usuario autenticado
    try {
      // Usamos firstValueFrom en lugar de .toPromise()
      await firstValueFrom(
        this.userInfoService.saveUserInfo(userId, this.age, this.address)
      );
      this.showAlert('Éxito', 'La información se guardó correctamente');
    } catch (error) {
      this.showAlert('Error', 'No se pudo guardar la información');
      console.error(error);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
