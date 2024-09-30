import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  async registerUser(email: string, password: string) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;

    // Enviar correo de verificación
    if (user) {
      await user.sendEmailVerification();
    }
    return userCredential;
  }

  async saveUserData(
    uid: string,
    name: string,
    email: string,
    password: string
  ) {
    return await this.firestore.collection('Usuarios').doc(uid).set({
      name,
      email,
      password,
    });
  }

  async loginUser(email: string, password: string) {
    return await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Método para cerrar sesión
  async logoutUser() {
    return await this.afAuth.signOut();
  }
}
