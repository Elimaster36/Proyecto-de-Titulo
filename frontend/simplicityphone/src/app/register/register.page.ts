import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  constructor() {}

  ngOnInit() {}
  name!: string;
  email!: string;
  password!: string;

  registrarse() {
    console.log('Nombre: ', this.name);
    console.log('Correo: ', this.email);
    console.log('Contraseña: ', this.password);
    // Aquí puedes añadir la lógica para registrar el usuario
  }
}
