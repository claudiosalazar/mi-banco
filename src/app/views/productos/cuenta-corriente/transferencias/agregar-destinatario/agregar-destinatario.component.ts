import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-agregar-destinatario',
  templateUrl: './agregar-destinatario.component.html'
})
export class AgregarDestinatarioComponent implements OnInit{

  crearDestinatarioForm: FormGroup = new FormGroup({});
  campoVacio: boolean = false;
  datoValido: boolean = false;
  nombreDestinatario: any;
  rutDestinatario: any;
  numeroCuentaDestinatario: any;
  emailDestinatario: any;
  submitted: boolean = false;

  // Array lista de
  listaBancos = [
    { value: '0', label: '-' },
    { value: '1', label: 'Banco de Chile' },
    { value: '2', label: 'Banco Internacional' },
    { value: '3', label: 'Scotiabank Chile' },
    { value: '4', label: 'BCI' },
    { value: '5', label: 'Corpbanca' },
    { value: '6', label: 'Banco BICE' },
    { value: '7', label: 'HSBC Bank' },
    { value: '8', label: 'Banco Santander' },
    { value: '9', label: 'Banco ITAÚ' },
    { value: '10', label: 'Banco Security' },
    { value: '11', label: 'Banco Falabella' },
    { value: '12', label: 'Deutsche Bank' },
    { value: '13', label: 'Banco Ripley' },
    { value: '14', label: 'Rabobank Chile' },
    { value: '15', label: 'Banco Consorcio' },
    { value: '16', label: 'Banco Penta' },
    { value: '17', label: 'Banco Paris' },
    { value: '18', label: 'BBVA' },
    { value: '19', label: 'Banco BTG Pactual Chile' },
    { value: '20', label: 'Banco do Brasil S.A.' },
    { value: '21', label: 'JP Morgan Cahse Bank, N. A.' },
    { value: '22', label: 'Banco de La Nación Argentina' },
    { value: '23', label: 'The Bank of Tokyo-Mitsubishi UFJ, LTD' },
    { value: '24', label: 'BCI - Miami' },
    { value: '25', label: 'Banco del Estado de Chile - Nueva York' },
    { value: '26', label: 'Corpbanca - Nueva York' },
    { value: '27', label: 'Banco del Estado de Chile' }
  ];

  // Array de tipos de cuenta
  tiposCuenta = [
    { value: '0', label: '-' },
    { value: '1', label: 'Cuenta Corriente' },
    { value: '2', label: 'Cuenta Vista' },
    { value: '3', label: 'Cuenta de Ahorro', },
    { value: '4', label: 'Cuenta Bancaria para estudiante' },
    { value: '5', label: 'Cuenta Chequera Electrónica' },
    { value: '6', label: 'Cuenta Bancaria para extranjeros' },
  ];
  
  selectClass: any;

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

  validaFormulario() {
    Object.keys(this.crearDestinatarioForm.controls).forEach(field => {
      const control = this.crearDestinatarioForm.get(field);
      if (control) {
      control.markAsTouched({ onlySelf: true });
      }
    });
  }

  resetFormulario() {
    this.crearDestinatarioForm.reset();
  }

  guardarDestinatario() {
    this.validaFormulario();

    if (this.crearDestinatarioForm.valid) {
      console.log('Formulario válido, se puede enviar');
      // Aquí puedes poner el código para enviar el formulario
    } else {
      console.log('Formulario inválido, por favor corrige los errores');
    }
  }

}
