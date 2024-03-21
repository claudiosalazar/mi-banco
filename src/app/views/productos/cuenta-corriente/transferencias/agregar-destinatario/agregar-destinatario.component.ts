import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-agregar-destinatario',
  templateUrl: './agregar-destinatario.component.html'
})
export class AgregarDestinatarioComponent implements OnInit{

  crearDestinatarioForm: FormGroup = new FormGroup({});

  constructor() {}

  ngOnInit(): void {
    this.crearDestinatarioForm = new FormGroup({
      nombreDestinatario: new FormControl('', [Validators.required]),
      apodoDestinatario: new FormControl(''),
      rutDestinatario: new FormControl('', [Validators.required]),
      bancoDestinatario: new FormControl('', [Validators.required]),
      tipoCuentaDestinatario: new FormControl('', [Validators.required]),
      numeroCuentaDestinatario: new FormControl('', [Validators.required]),
      emailDestinatario: new FormControl('', [Validators.required]),
      celularDestinatario: new FormControl(''),
      telefonoDestinatario: new FormControl(''),
    });
  }

}
