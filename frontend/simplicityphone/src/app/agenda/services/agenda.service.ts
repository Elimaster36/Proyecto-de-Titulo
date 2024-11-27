import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, from, catchError } from 'rxjs';
import { Agenda } from 'src/app/models/agenda';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AgendaService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/agendas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): Observable<HttpHeaders> {
    return from(this.authService.getUser()).pipe(
      switchMap((user) => {
        if (user) {
          return from(user.getIdToken()).pipe(
            switchMap((token) => {
              const headers = new HttpHeaders({
                Authorization: `Bearer ${token}`,
              });
              return [headers];
            })
          );
        } else {
          throw new Error('User not authenticated');
        }
      })
    );
  }

  getNotes(): Observable<Agenda[]> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.http.get<Agenda[]>(this.apiUrl, { headers }))
    );
  }

  getNoteById(id: number): Observable<Agenda> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<Agenda>(`${this.apiUrl}/${id}`, { headers })
      )
    );
  }

  createNote(note: Agenda): Observable<Agenda> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.authService.getUser().pipe(
          switchMap((user) => {
            if (user) {
              const firebaseId = user.uid;
              const noteWithFirebaseId = { ...note, firebase_id: firebaseId };
              return this.http
                .post<Agenda>(this.apiUrl, noteWithFirebaseId, { headers })
                .pipe(
                  catchError((error) => {
                    console.error('Error creating agenda', error);
                    throw error;
                  })
                );
            } else {
              throw new Error('User not authenticated');
            }
          })
        )
      )
    );
  }
  updateNote(note: Agenda, id: number): Observable<Agenda> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.authService.getUser().pipe(
          switchMap((user) => {
            if (user) {
              // Obtener firebase_id del usuario
              const firebaseId = user.uid;
              const noteWithFirebaseId = { ...note, firebase_id: firebaseId };
              return this.http.put<Agenda>(
                `${this.apiUrl}/${id}`,
                noteWithFirebaseId,
                { headers }
              );
            } else {
              throw new Error('User not authenticated');
            }
          })
        )
      )
    );
  }

  deleteNote(id: number): Observable<void> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.authService.getUser().pipe(
          switchMap((user) => {
            if (user) {
              const firebaseId = user.uid;
              return this.http.delete<void>(
                `${this.apiUrl}/${id}?firebase_id=${firebaseId}`,
                { headers }
              );
            } else {
              throw new Error('User not authenticated');
            }
          })
        )
      )
    );
  }
}
