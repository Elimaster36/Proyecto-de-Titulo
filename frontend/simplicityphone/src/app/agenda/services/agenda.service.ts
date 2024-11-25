import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agenda } from 'src/app/models/agenda';

@Injectable({
  providedIn: 'root',
})
export class AgendaService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/agenda/';

  constructor(private http: HttpClient) {}

  getNotes(idToken: string): Observable<Agenda[]> {
    const params = new HttpParams().set('idToken', idToken);
    return this.http.get<Agenda[]>(this.apiUrl, { params });
  }

  saveNote(note: Agenda): Observable<Agenda> {
    return this.http.post<Agenda>(this.apiUrl, note);
  }

  updateNote(note: Agenda, noteId: number): Observable<Agenda> {
    return this.http.put<Agenda>(`${this.apiUrl}${noteId}`, note);
  }

  deleteNote(noteId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${noteId}`);
  }
}
