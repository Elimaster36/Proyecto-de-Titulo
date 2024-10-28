import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Preferences } from 'src/app/models/preferences';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  preferences: Preferences = {
    button_size: 0,
    text_size: 0,
    image_size: 0,
  };

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

  // En tu método loginUser
  async loginUser(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        return firstValueFrom(
          this.afAuth.idToken.pipe(
            switchMap((token) => {
              return this.http
                .post(
                  'http://localhost:8000/login',
                  {}, // Si es necesario incluir el cuerpo de la solicitud
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                )
                .pipe(
                  catchError((err) => {
                    console.error('Error during login:', err);
                    return throwError(() => err);
                  })
                );
            })
          )
        );
      })
      .then(() => {
        console.log('User logged in and preferences checked/created');
      })
      .catch((error) => {
        console.error('Login error:', error);
      });
  }

  async logoutUser() {
    return await this.afAuth.signOut();
  }

  getPreferences() {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          const userId = user.uid;
          return this.afAuth.idToken.pipe(
            switchMap((token) => {
              return this.http.get<Preferences>(
                `http://localhost:8000/preferences/${userId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
            })
          );
        } else {
          return throwError('User not authenticated');
        }
      }),
      catchError((err) => {
        console.error('Error getting preferences:', err);
        return throwError(() => err);
      })
    );
  }

  updatePreferences(preferences: Preferences) {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          const userId = user.uid;
          return this.afAuth.idToken.pipe(
            switchMap((token) => {
              return this.http.put(
                `http://localhost:8000/preferences/${userId}`,
                preferences,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
            })
          );
        } else {
          return throwError('User not authenticated');
        }
      }),
      catchError((err) => {
        console.error('Error updating preferences:', err);
        return throwError(() => err);
      })
    );
  }
}
