import { Component, OnInit } from '@angular/core';
import { UserInfoService } from 'src/app/configuration/services/user-info.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-quien-soy',
  templateUrl: './quien-soy.page.html',
  styleUrls: ['./quien-soy.page.scss'],
})
export class QuienSoyPage implements OnInit {
  userInfo: any;

  constructor(
    private authService: AuthService,
    private userInfoService: UserInfoService
  ) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  async loadUserInfo() {
    const currentUser = await this.authService.getUser();
    if (currentUser) {
      this.userInfoService.getUserInfo(currentUser.uid).subscribe({
        next: (response) => {
          console.log('User info loaded successfully', response);
          this.userInfo = response;
        },
        error: (error) => {
          console.error('Error loading user info', error);
        },
        complete: () => {
          console.log('Request completed');
        },
      });
    }
  }
}
