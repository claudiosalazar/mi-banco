import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ValidaRutService } from '../../services/validaRut.service';

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
  isPasswordVisible: boolean = false;
  inputValidoRut: any;

  constructor(
    private authService: AuthService,
    private validaRutService: ValidaRutService,
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

  validaRut(_userName: string): boolean {
    const userNameControl = this.formularioLogin.get('userName');
    if (userNameControl) {
      const userName = userNameControl.value as any;
  
      if (userName.trim() === '') {
        userNameControl.setErrors({ 'inputErrorVacioRut': true });
      } else {
        // Eliminar caracteres no numéricos y obtener el cuerpo y el dígito verificador
        const rutSinFormato = userName.replace(/[^0-9kK]/g, '');
        const cuerpo = rutSinFormato.slice(0, -1);
        const dv = rutSinFormato.slice(-1).toLowerCase();
  
        if (cuerpo.length < 7 || cuerpo.length > 8) {
          userNameControl.setErrors({ 'rutInvalido': true });
        } else {
          const dvCalculado = this.validaRutService.calcularVerificador(cuerpo);
  
          if (dv !== dvCalculado) {
            userNameControl.setErrors({ 'rutInvalido': true });
          } else {
            userNameControl.setErrors(null);
  
            // Detectar el formato del RUT ingresado
            const tienePunto = userName.includes('.');
            const tieneGuion = userName.includes('-');
  
            if (!tienePunto && !tieneGuion) {
              // Sin '.' ni '-'
              userNameControl.setValue(this.rutPipe.transform(userName));
            } else if (tienePunto && !tieneGuion) {
              // Con '.' pero sin '-'
              const rutConGuion = `${userName.slice(0, -1)}-${userName.slice(-1)}`;
              userNameControl.setValue(rutConGuion);
            } else if (!tienePunto && tieneGuion) {
              // Sin '.' pero con '-'
              const partes = userName.split('-');
              let cuerpo = partes[0];
              const dv = partes[1];
  
              // Agregar puntos en las posiciones adecuadas
              if (cuerpo.length === 7) {
                cuerpo = `${cuerpo.slice(0, 1)}.${cuerpo.slice(1, 4)}.${cuerpo.slice(4)}`;
              } else if (cuerpo.length === 8) {
                cuerpo = `${cuerpo.slice(0, 2)}.${cuerpo.slice(2, 5)}.${cuerpo.slice(5)}`;
              }
  
              userNameControl.setValue(`${cuerpo}-${dv}`);
            }
          }
        }
      }
  
      this.inputValidoRut = userNameControl.valid;
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
        this.authService.mibanco(user).subscribe(
          (res: any) => {
            localStorage.setItem('token', res.token);
            localStorage.setItem('id_user', res.id_user);
            this.router.navigate(['mibanco']);
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