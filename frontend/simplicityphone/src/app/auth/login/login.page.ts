import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authFacade: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {}

  showPassword = false;
  toggleShowPassword() {
    this.showPassword = !this.showPassword; // Cambia el estado de visibilidad
  }

  // Función que maneja el inicio de sesión
  async onLogin() {
    // Solo continúa si todos los campos son válidos
    try {
      const result = await this.authFacade.loginUser(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
      console.log('Inicio de sesión exitoso', result);
      this.router.navigate(['/home']);
    } catch (error: any) {
      if (!this.loginForm.value.email || !this.loginForm.value.password) {
        this.presentAlert(
          'Campos vacios',
          'Por favor, ingresa todos los campos'
        );
      } else if (error.code === 'auth/invalid-credential') {
        this.presentAlert(
          'Credenciales Incorrectas',
          'Por favor, ingrese credenciales correctas'
        );
      } else if (error.code === 'auth/invalid-email') {
        this.presentAlert(
          'Correo invalido',
          'Por favor, ingrese un correo valido'
        );
      } else {
        this.presentAlert('Error', 'Ocurrió un error inesperado');
      }
    }
  }

  // Método para mostrar alertas
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
