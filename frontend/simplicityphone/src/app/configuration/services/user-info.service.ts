import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfo } from 'src/app/models/user-info';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1';

  constructor(private http: HttpClient) {}

  createUserInfo(data: FormData) {
    return this.http.post(`${this.apiUrl}/quien_soy`, data);
  }

  getUserInfo(firebase_id: string): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/quien_soy/${firebase_id}`);
  }

  updateUserInfo(userFirebaseId: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/quien_soy/${userFirebaseId}`, data);
  }
}
