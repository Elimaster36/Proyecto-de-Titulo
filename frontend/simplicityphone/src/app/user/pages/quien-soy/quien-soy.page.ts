import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserInfoService } from 'src/app/configuration/services/user-info.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserInfo } from 'src/app/models/user-info';

@Component({
  selector: 'app-quien-soy',
  templateUrl: './quien-soy.page.html',
  styleUrls: ['./quien-soy.page.scss'],
})
export class QuienSoyPage implements OnInit {
  userInfoForm!: FormGroup;
  userFirebaseId!: string;
  userInfo: UserInfo | null = null;
  isEditing: boolean = false; // Estado para controlar el modo edición
  photo!: File;

  constructor(
    private authService: AuthService,
    private userInfoService: UserInfoService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.userInfoForm = this.formBuilder.group({
      full_name: [''],
      age: [''],
      address: [''],
      photo: [null],
    });
  }

  async loadUserInfo() {
    const currentUser = await this.authService.getUser();
    if (currentUser) {
      this.userFirebaseId = currentUser.uid;
      this.userInfoService.getUserInfo(this.userFirebaseId).subscribe({
        next: (response: UserInfo) => {
          console.log('User info loaded successfully', response);
          this.userInfo = response;
          this.userInfoForm.patchValue({
            full_name: response.full_name,
            age: response.age,
            address: response.address,
          });
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

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.photo = input.files[0];
    }
  }

  editUserInfo() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    if (this.userInfo) {
      this.userInfoForm.patchValue({
        full_name: this.userInfo.full_name,
        age: this.userInfo.age,
        address: this.userInfo.address,
      });
    }
  }

  updateUserInfo() {
    if (!this.isEditing) return; // Evitar actualizaciones fuera del modo edición

    const formData = new FormData();
    formData.append('full_name', this.userInfoForm.get('full_name')!.value);
    formData.append('age', this.userInfoForm.get('age')!.value.toString());
    formData.append('address', this.userInfoForm.get('address')!.value);
    if (this.photo) {
      formData.append('file', this.photo, this.photo.name); // Asegurarse de que el archivo se añade al FormData
    }

    this.userInfoService
      .updateUserInfo(this.userFirebaseId, formData)
      .subscribe({
        next: (response) => {
          console.log('User info updated successfully', response);
          this.loadUserInfo(); // Recargar la información del usuario
          this.isEditing = false; // Salir del modo edición
        },
        error: (error) => {
          console.error('Error updating user info', error);
        },
      });
  }
}
