import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
          ),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  ngOnInit() {}
  showPassword = false;

  // Función para cambiar la visibilidad de la contraseña
  toggleShowPassword() {
    this.showPassword = !this.showPassword; // Cambia el estado de visibilidad
  }

  // Función que maneja el registro
  async onRegister() {
    // Solo continúa si todos los campos son válidos
    try {
      const result = await this.auth.registerUser(
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.name
      );
      console.log('Registro exitoso', result);

      await this.showSuccessAlert(
        'Registro Exitoso',
        'Te has registrado correctamente'
      );

      this.router.navigate(['/login']);
    } catch (error: any) {
      if (error.message === 'El correo ya está registrado.') {
        this.showAlert(
          'Correo Duplicado',
          'El correo ingresado ya está registrado, por favor ingrese un correo nuevo.'
        );
      } else {
        console.error('Error durante el registro', error);
      }
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

  async showSuccessAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
