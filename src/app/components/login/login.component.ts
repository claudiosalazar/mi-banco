import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

// Pipes
import { RutPipe } from '../../shared/pipes/rut.pipe';

@Component({
  selector: 'mb-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  formularioLogin: FormGroup;
  botonLoginDisabled = true;
  mensajeError = false;
  isPasswordVisible: boolean = false; // Nueva propiedad

  constructor(
    private authService: AuthService,
    private router: Router,
    private rutPipe: RutPipe,
  ) {
    this.formularioLogin = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      pass: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    const userNameControl = this.formularioLogin.get('userName');
    if (userNameControl) {
      userNameControl.setValue(this.rutPipe.transform(userNameControl.value));
    }

    // Suscribirse a los cambios en el formulario
    this.formularioLogin.valueChanges.subscribe(() => {
      this.botonLoginDisabled = !this.formularioLogin.valid;
    });
  }

  formatoRut(): void {
    const userNameControl = this.formularioLogin.get('userName');
    if (userNameControl) {
      const value = userNameControl.value;
      // Verificar si el valor contiene '.' o '-'
      if (value.includes('.') || value.includes('-')) {
        // No aplicar la lógica si contiene '.' o '-'
        return;
      }
      // Aplicar el pipe de RUT
      const rut = this.rutPipe.transform(value);
      // Contar los dígitos
      const digitos = rut.replace(/[^0-9]/g, '').length;
      if (digitos < 8 || digitos > 9) {
        userNameControl.setErrors({ 'rutInvalido': true });
      } else {
        userNameControl.setValue(rut);
        userNameControl.setErrors(null);
      }
    }
  }

  validaRut(_userName: string): boolean {
    const userNameControl = this.formularioLogin.get('userName');
    if (userNameControl) {
      userNameControl.markAsTouched();
      const userName = userNameControl.value as any;
  
      if (userName.length < 8 || userName.length > 9) {
        userNameControl.setErrors({ 'rutInvalido': true });
      } else {
        userNameControl.setErrors(null);
        userNameControl.setValue(this.rutPipe.transform(userName));
      }
    }
    return true;
  }

  resetUserName(): void {
    const userNameControl = this.formularioLogin.get('userName');
    if (userNameControl) {
      userNameControl.setErrors(null);
      userNameControl.reset();
    }
  }

  resetPass(): void {
    const passControl = this.formularioLogin.get('pass');
    if (passControl) {
      passControl.reset();
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  logIn() {
    if (this.formularioLogin.valid) {
      const userNameControl = this.formularioLogin.get('userName');
      if (userNameControl) {
        const userName = userNameControl.value.replace(/\D/g, '');
        
        // Nueva condición antes de enviar los datos
        if (userName.length < 8 || userName.length > 9) {
          this.mensajeError = true;
          return;
        }
  
        const user = {
          ...this.formularioLogin.value,
          userName: userName
        };
        console.log(user);
        this.authService.mibanco(user).subscribe(
          (res: any) => {
            console.log(res);
            if (res.token && res.id_user) {
              localStorage.setItem('token', res.token);
              localStorage.setItem('id_user', res.id_user);
              this.router.navigate(['mibanco']);
            } else {
              console.error('El token o id_user no están presentes en la respuesta');
              this.mensajeError = true;
            }
          },
          (err) => {
            if (err.status === 401) {
              this.mensajeError = true;
            }
          }
        );
      }
    } else {
      this.mensajeError = true;
    }
  }

}