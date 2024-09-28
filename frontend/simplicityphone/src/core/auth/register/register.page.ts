import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authFacade: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  ngOnInit() {}

  // Función para cambiar la visibilidad de la contraseña
  //toggleMostrarContrasena() {
  //  this.mostrarContrasena = !this.mostrarContrasena;
  //}

  // Función que maneja el registro
  async onRegister() {
    // Solo continúa si todos los campos son válidos
    try {
      const result = await this.authFacade.registerUser(
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.name
      );
      console.log('Registro exitoso', result);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error durante el registro', error);
    }
  }
}
