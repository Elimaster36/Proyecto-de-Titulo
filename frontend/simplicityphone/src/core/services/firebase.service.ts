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
    return await this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  async saveUserData(
    uid: string,
    name: string,
    email: string,
    password: string,
    verified: boolean
  ) {
    return await this.firestore.collection('Usuarios').doc(uid).set({
      name,
      email,
      password,
      email_verified: verified,
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
