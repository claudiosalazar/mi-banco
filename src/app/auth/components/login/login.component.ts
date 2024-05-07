import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

// Pipe
import { RutPipe } from '../../../shared/pipes/rut.pipe';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, AfterViewInit {

  formularioLogin: FormGroup = new FormGroup({});

  rutInvalido: any;
  rutIncorrecto: any;
  claveIncorrecta: any;

  mensajeError = false;

  botonLoginDisabled = false;

  usuario: any;

  constructor(
    private authService: AuthService,
    private rutPipe: RutPipe,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.formularioLogin = new FormGroup({
      rutUsuario: new FormControl('', [Validators.required]),
      claveUsuario: new FormControl('', [Validators.required]),
    });  
  }

  ngAfterViewInit(): void {
    const rutUsuarioControl = this.formularioLogin.get('rutUsuario');
    const claveUsuarioControl = this.formularioLogin.get('claveUsuario'); // Reemplaza 'otroInput' con el nombre real del otro input
  
    if (rutUsuarioControl && claveUsuarioControl) {
      rutUsuarioControl.valueChanges.subscribe(() => {
        this.checkInputs(rutUsuarioControl, claveUsuarioControl);
      });
  
      claveUsuarioControl.valueChanges.subscribe(() => {
        this.checkInputs(rutUsuarioControl, claveUsuarioControl);
      });
    }
  }
  
  checkInputs(rutUsuarioControl: AbstractControl, claveUsuarioControl: AbstractControl): void {
    if (rutUsuarioControl.value && claveUsuarioControl.value) {
      this.botonLoginDisabled = !rutUsuarioControl.errors?.rutInvalido;
    } else {
      this.botonLoginDisabled = false;
    }
  }

  validaRut(): void {
    const rutUsuarioControl = this.formularioLogin.get('rutUsuario');
    if (rutUsuarioControl) {
      rutUsuarioControl.markAsTouched();
      const rutUsuario = rutUsuarioControl.value as any;
  
      if (rutUsuario.length < 8 || rutUsuario.length > 9) {
        rutUsuarioControl.setErrors({ 'rutInvalido': true });
      } else {
        rutUsuarioControl.setErrors(null);
        rutUsuarioControl.setValue(this.rutPipe.transform(rutUsuario));
      }
    }
  }

  resetRutUsuario(): void {
    const rutUsuarioControl = this.formularioLogin.get('rutUsuario');
    if (rutUsuarioControl) {
      rutUsuarioControl.reset();
    }
  }

  resetClaveUsuario(): void {
    const claveUsuarioControl = this.formularioLogin.get('claveUsuario');
    if (claveUsuarioControl) {
      claveUsuarioControl.reset();
    }
  }

  formatoRut(): void {
    const rutUsuarioControl = this.formularioLogin.get('rutUsuario');
    if (rutUsuarioControl) {
      const value = rutUsuarioControl.value;
      // Aplicar el pipe de RUT
      const rut = this.rutPipe.transform(value);
      // Contar los dígitos
      const digitos = rut.replace(/[^0-9]/g, '').length;
      if (digitos < 8) {
        rutUsuarioControl.setErrors({ 'rutInvalido': true });
      } else {
        rutUsuarioControl.setValue(rut);
        rutUsuarioControl.setErrors(null);
      }
    }
  }

  loginMiBanco(): void {
    // Obtén los datos del usuario del formulario
    const rutUsuarioControl = this.formularioLogin.get('rutUsuario');
    const claveUsuarioControl = this.formularioLogin.get('claveUsuario');
  
    if (rutUsuarioControl && claveUsuarioControl) {
      this.usuario = {
        rutUsuario: rutUsuarioControl.value.replace(/\D/g, ''),
        claveUsuario: claveUsuarioControl.value
      };
  
      this.authService.autentificacion(this.usuario).subscribe(autenticado => {
        console.log('Resultado de la autenticación:', autenticado);
        if (autenticado) {
          console.log('Navegando a mibanco...');
          this.router.navigate(['mibanco']);
        } else if (!autenticado) {
          console.log('Credenciales inválidas, mostrando error...');
          this.mensajeError = true;
        }
      });
    }
  }
}