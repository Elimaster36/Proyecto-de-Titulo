import { Component } from '@angular/core';
import { UserInfoService } from '../../services/user-info.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-who-am-i',
  templateUrl: './who-am-i.page.html',
  styleUrls: ['./who-am-i.page.scss'],
})
export class WhoAmIPage {
  registerForm: FormGroup;
  photo!: File;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userInfoService: UserInfoService
  ) {
    this.registerForm = this.fb.group({
      full_name: ['', Validators.required],
      age: ['', Validators.required],
      address: ['', Validators.required],
      photo: [null],
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.photo = input.files[0];
    }
  }

  async submit() {
    const currentUser = await this.authService.getUser();
    if (currentUser) {
      const userInfo = new FormData();
      userInfo.append('user_firebase_id', currentUser.uid);
      userInfo.append('full_name', this.registerForm.value.full_name);
      userInfo.append('age', this.registerForm.value.age.toString());
      userInfo.append('address', this.registerForm.value.address);
      if (this.photo) {
        userInfo.append('file', this.photo, this.photo.name);
      }
      this.userInfoService.createUserInfo(userInfo).subscribe(
        (response) => {
          console.log('User info saved successfully', response);
        },
        (error) => {
          console.error('Error saving user info', error);
          console.error(error.error); // Añadir más detalles del error
        }
      );
    }
  }
}
