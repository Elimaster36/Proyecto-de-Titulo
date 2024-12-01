import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1';
  private apiUrl2 = 'http://127.0.0.1:8000/api/v1/feeds';

  constructor(private http: HttpClient) {}

  getNews(): Observable<any> {
    return this.http.get(`${this.apiUrl}/news/`);
  }

  fetchAndStoreNews(): Observable<any> {
    return this.http.post(`${this.apiUrl}/news/`, {});
  }

  getUserFeeds(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user-feeds/${userId}`);
  }

  createFeed(feedData: {
    usuario_id: string;
    noticia_id: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/feeds/`, feedData);
  }

  markFeedAsRead(feedId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl2}/${feedId}/mark-as-read`, {});
  }
}
