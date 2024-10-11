import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  beforeEach(() => {
    const authServiceMock = {
      registerUser: jasmine.createSpy('registerUser').and.returnValue(of({})),
    };

    const firebaseServiceMock = {
      registerUser: jasmine
        .createSpy('registerUser')
        .and.returnValue(Promise.resolve({ user: { uid: '123' } })),
      saveUserData: jasmine
        .createSpy('saveUserData')
        .and.returnValue(Promise.resolve()),
    };

    const angularFireAuthMock = {
      signInWithEmailAndPassword: jasmine
        .createSpy('signInWithEmailAndPassword')
        .and.returnValue(Promise.resolve()),
    };

    TestBed.configureTestingModule({
      declarations: [RegisterPage],
      imports: [
        ReactiveFormsModule, // Importa ReactiveFormsModule
        FormsModule, // Importa FormsModule
        IonicModule.forRoot(), // Importa IonicModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: FirebaseService, useValue: firebaseServiceMock },
        { provide: AngularFireAuth, useValue: angularFireAuthMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the RegisterPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should mark the form as invalid when empty', () => {
    // Comprobar que el formulario es inválido cuando está vacío
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should validate the email field', () => {
    let email = component.registerForm.controls['email'];

    // El email debe ser requerido
    expect(email.errors?.['required']).toBeTruthy();

    // Probar con un email inválido
    email.setValue('email_invalido');
    expect(email.errors?.['pattern']).toBeTruthy();

    // Probar con un email válido
    email.setValue('test@test.com');
    expect(email.errors).toBeNull();
  });

  it('should call onRegister when form is valid', () => {
    spyOn(component, 'onRegister');

    // Establecer valores válidos en el formulario
    component.registerForm.controls['name'].setValue('Nombre de Prueba');
    component.registerForm.controls['email'].setValue('test@test.com');
    component.registerForm.controls['password'].setValue('12345678');

    // Verificar que el formulario es válido
    expect(component.registerForm.valid).toBeTruthy();

    // Simular la llamada manual a la función de registro
    component.onRegister();

    // Verificar que se haya llamado a la función onRegister
    expect(component.onRegister).toHaveBeenCalled();
  });
});
