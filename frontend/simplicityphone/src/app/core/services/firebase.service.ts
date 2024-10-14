import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { Preferences } from 'src/app/models/preferences';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  apiUrl = 'https://127.0.0.1:8000/api/preferences';
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private http: HttpClient
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

  async getUserPreferences() {
    const user = await this.afAuth.currentUser;
    if (user) {
      const firebaseUid = user.uid;
      return this.http
        .get<Preferences>(`${this.apiUrl}/${firebaseUid}`)
        .toPromise();
    }
    throw new Error('No user is logged in');
  }

  async saveUserPreferences(preferences: Preferences) {
    const user = await this.afAuth.currentUser;
    if (user) {
      const firebaseUid = user.uid;
      return this.http
        .post(`${this.apiUrl}/${firebaseUid}`, preferences)
        .toPromise();
    }
    throw new Error('No user is logged in');
  }

  // Método para cerrar sesión
  async logoutUser() {
    return await this.afAuth.signOut();
  }
}
