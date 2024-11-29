import { Component } from '@angular/core';
import { UserInfoService } from '../../services/user-info.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { firstValueFrom } from 'rxjs';
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
    try {
      // Obtener el usuario autenticado usando firstValueFrom
      const currentUser = await firstValueFrom(this.authService.getUser());
      if (currentUser) {
        const userInfo = new FormData();
        userInfo.append('user_firebase_id', currentUser.uid); // Ahora accedes correctamente a `uid`
        userInfo.append('full_name', this.registerForm.get('full_name')!.value);
        userInfo.append('age', this.registerForm.get('age')!.value.toString());
        userInfo.append('address', this.registerForm.get('address')!.value);
        if (this.photo) {
          userInfo.append('file', this.photo, this.photo.name);
        }

        // Enviar la información del usuario al backend
        this.userInfoService.createUserInfo(userInfo).subscribe({
          next: (response) => {
            console.log('User info saved successfully', response);
          },
          error: (error) => {
            console.error('Error saving user info', error);
          },
          complete: () => {
            console.log('Request completed');
          },
        });
      }
    } catch (error) {
      console.error('Error retrieving user', error);
    }
  }
}
