import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormatoEmailService {

  constructor() { }

  formatoEmail(control: FormControl): { [key: string]: boolean } | null {
    const emailValidator = Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);
    const error = emailValidator(control);
    return error ? { customEmail: true } : null;
  }

}