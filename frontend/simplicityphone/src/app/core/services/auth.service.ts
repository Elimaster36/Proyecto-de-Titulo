import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private firebaseService: FirebaseService) {}

  async registerUser(email: string, password: string, name: string) {
    try {
      // 1. Registrar el usuario en Firebase
      const userCredential = await this.firebaseService.registerUser(
        email,
        password
      );
      const user = userCredential.user;

      // 2. Obtener el token del usuario autenticado en Firebase

      // 3. Guardar los datos del usuario en Firestore
      if (user) {
        await this.firebaseService.saveUserData(
          user.uid,
          name,
          email,
          password
        );
        return { user: user.uid, email: user.email };
      } else {
        return null;
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        // Error específico de correo existente
        throw new Error('El correo ya está registrado.');
      } else {
        console.error('Error durante el registro:', error);
        throw error;
      }
    }
  }

  // Método para iniciar sesión
  async loginUser(email: string, password: string) {
    return await this.firebaseService.loginUser(email, password);
  }

  // Método para cerrar sesión
  async logoutUser() {
    return await this.firebaseService.logoutUser();
  }
}
