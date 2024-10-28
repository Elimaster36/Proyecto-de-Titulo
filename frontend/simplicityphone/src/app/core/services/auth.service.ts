import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';

const API_URL = 'http://127.0.0.1:8000/api/v1';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(initializeApp(environment.firebaseConfig));

  constructor(private http: HttpClient, private afAuth: AngularFireAuth) {}

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
}
