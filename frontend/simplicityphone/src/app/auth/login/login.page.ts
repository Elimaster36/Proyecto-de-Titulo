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
      // Si los campos están vacíos, mostrar la alerta correspondiente
      if (!this.loginForm.value.email || !this.loginForm.value.password) {
        await this.presentAlert(
          'Campos vacios',
          'Por favor, ingresa todos los campos'
        );
      }
      return; // Detener la ejecución si los campos están vacíos
    }
    // Solo continúa si todos los campos son válidos
    try {
      const result = await this.authService.loginUser(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
      console.log('Inicio de sesión exitoso', result);
      this.router.navigate(['/home']);
    } catch (error: any) {
      if (error.error && error.error.detail === 'Invalid email or password') {
        this.presentAlert(
          'Credenciales Incorrectas',
          'Por favor, ingrese credenciales correctas'
        );
      } else if (
        error.error &&
        error.error.detail === 'Authorization header missing'
      ) {
        this.presentAlert(
          'Correo invalido',
          'Por favor, ingrese un correo valido'
        );
      } else {
        this.presentAlert('Error', 'Ocurrió un error inesperado');
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
