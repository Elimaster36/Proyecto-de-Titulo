import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1';

  constructor(private http: HttpClient) {}

  createUserInfo(data: FormData) {
    return this.http.post(`${this.apiUrl}/quien_soy`, data);
  }

  getUserInfo(firebase_id: string) {
    return this.http.get(`${this.apiUrl}/quien_soy/${firebase_id}`);
  }
}
