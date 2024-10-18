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
  showPassword = false;

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

  toggleShowPassword() {
    this.showPassword = !this.showPassword; // Cambia el estado de visibilidad
  }

  async onRegister() {
    // Verifica si el formulario de registro es inválido
    if (this.registerForm.invalid) {
      // Si los campos son inválidos, no continúa
      return;
    }
    try {
      // Llama al método del servicio para registrar el usuario
      const result = await this.auth.registerUser(
        this.registerForm.value.name,
        this.registerForm.value.email,
        this.registerForm.value.password
      );
      // Registro exitoso
      console.log('Registro exitoso', result);
      await this.showSuccessAlert(
        'Registro Exitoso',
        'Te has registrado correctamente'
      );
      // Redirige al login después del registro exitoso
      this.router.navigate(['/login']);
    } catch (error: any) {
      // Maneja errores específicos del registro
      if (error.error && error.error.detail === 'Email already registered') {
        this.showAlert(
          'Correo Duplicado',
          'El correo ingresado ya está registrado, por favor ingrese un correo nuevo.'
        );
      } else {
        // Maneja cualquier otro error inesperado
        console.error('Error durante el registro', error);
        this.showAlert('Error', 'Ocurrió un error inesperado');
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
