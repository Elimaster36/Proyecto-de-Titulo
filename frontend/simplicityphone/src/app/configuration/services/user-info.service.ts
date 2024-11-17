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

  getUserInfo(userId: number): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/user-info/${userId}`);
  }

  saveUserInfo(userId: number, age: number, address: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user-info`, {
      user_id: userId,
      age: age,
      address: address,
    });
  }
}
