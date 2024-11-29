import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { News } from 'src/app/models/news';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/news';

  constructor(private http: HttpClient) {}

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(this.apiUrl);
  }
}
