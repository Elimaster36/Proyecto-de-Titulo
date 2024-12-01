import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app'; // Importar desde compat
import 'firebase/compat/auth';

const API_URL = 'http://127.0.0.1:8000/api/v1';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(initializeApp(environment.firebaseConfig));

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  async registerUser(
    name: string,
    email: string,
    password: string
  ): Promise<any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const idToken = await userCredential.user?.getIdToken();
      return firstValueFrom(
        this.http.post(`${API_URL}/register`, {
          name,
          email,
          password,
          idToken,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  async loginUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  async logout() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout error', error);
    }
  }

  // Método para obtener el usuario actual
  getUser(): Observable<firebase.User | null> {
    return new Observable((observer) => {
      firebase.auth().onAuthStateChanged((user) => {
        observer.next(user); // Emitir el usuario actual (o null si no está autenticado)
      });
    });
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser; // Devuelve el usuario o null
  }
}
