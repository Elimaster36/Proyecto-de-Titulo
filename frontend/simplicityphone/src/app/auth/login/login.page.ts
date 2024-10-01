import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {}

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
    } catch (error) {
      console.error('Error durante el inicio de sesión', error);
      // Aquí podrías mostrar una alerta para indicar que hubo un error
    }
  }
}
