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
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {}

  toggleShowPassword() {
    this.showPassword = !this.showPassword; // Cambia el estado de visibilidad
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      if (this.loginForm.controls['email'].errors) {
        await this.presentAlert(
          'Correo inválido',
          'Por favor, ingresa un correo válido'
        );
      } else if (this.loginForm.controls['password'].errors) {
        await this.presentAlert(
          'Contraseña inválida',
          'La contraseña debe tener al menos 8 caracteres'
        );
      } else {
        await this.presentAlert(
          'Campos vacíos',
          'Por favor, ingresa todos los campos'
        );
      }
      return;
    }

    try {
      const result = await this.authService.loginUser(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
      console.log('Inicio de sesión exitoso', result);
      this.router.navigate(['/home']);
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        await this.presentAlert(
          'Credenciales incorrectas',
          'Por favor, ingresa credenciales correctas'
        );
      } else {
        await this.presentAlert(
          'Ocurrio un error',
          'Ocurrio un error inesperado'
        );
      }
    }
  }
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
