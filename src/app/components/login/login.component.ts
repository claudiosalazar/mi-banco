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
  botonLoginDisabled = false;
  mensajeError = false;

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
  }

  logIn() {
    if (this.formularioLogin.valid) {
      const user = this.formularioLogin.value;
      console.log(user);
      this.authService.mibanco(user).subscribe((res: any) => {
        console.log(res);
        localStorage.setItem('token', res.token);
        this.router.navigate(['mibanco']);
      });
    } else {
      this.mensajeError = true;
    }
  }
}