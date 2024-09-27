import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  constructor(private authFacade: AuthService, private router: Router) {}

  ngOnInit() {}
  email: string = '';
  password: string = '';
  name: string = '';

  async onRegister() {
    const result = await this.authFacade.registerUser(
      this.email,
      this.password,
      this.name
    );
    console.log('Registro exitoso', result);
    this.router.navigate(['/home']);
  }
  catch(error: any) {
    console.error('Error durante el registro', error);
  }
}
