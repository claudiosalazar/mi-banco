import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../../services/datos-usuario.service';

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html'
})
export class CuentaCorrienteComponent implements OnInit {
  datosUsuarioActual: any;

  constructor(
    private datosUsuarioService: DatosUsuarioService
  ) { }

  ngOnInit(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(datos => {
      this.datosUsuarioActual = datos;
      console.log(this.datosUsuarioActual);
    }, error => {
      console.error('Error obteniendo los datos: ', error);
    });

    
  }
}