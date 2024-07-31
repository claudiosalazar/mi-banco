import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

// Pipes
import { RutPipe } from '../../shared/pipes/rut.pipe';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  user = {
    userName: '',
    pass: ''
  };

  formularioLogin: FormGroup = new FormGroup({});
  botonLoginDisabled = false;
  mensajeError = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private rutPipe: RutPipe,
  ) { }

  ngOnInit(): void {
    this.user.userName = this.rutPipe.transform(this.user.userName);
  }

  logIn() {
    console.log(this.user);
    this.authService.mibanco(this.user).subscribe( (res: any) => {
      console.log(res);
      localStorage.setItem('token', res.token);
      this.router.navigate(['mibanco']);
    });
  }

}
