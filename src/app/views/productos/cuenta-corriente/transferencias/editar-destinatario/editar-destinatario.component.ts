import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-destinatario',
  templateUrl: './editar-destinatario.component.html'
})
export class EditarDestinatarioComponent implements OnInit{

  editarDestinatarioForm: FormGroup = new FormGroup({});

  constructor() {}

  ngOnInit(): void {
    this.editarDestinatarioForm = new FormGroup({
      nombreDestinatario: new FormControl('', [Validators.required]),
      apodoDestinatario: new FormControl('', [Validators.required]),
      rutDestinatario: new FormControl('', [Validators.required]),
      bancoDestinatario: new FormControl('', [Validators.required]),
      tipoCuentaDestinatario: new FormControl('', [Validators.required]),
      numeroCuentaDestinatario: new FormControl('', [Validators.required]),
      emailDestinatario: new FormControl('', [Validators.required]),
      celularDestinatario: new FormControl('', [Validators.required]),
      telefonoDestinatario: new FormControl('', [Validators.required]),
    });
  }

}
