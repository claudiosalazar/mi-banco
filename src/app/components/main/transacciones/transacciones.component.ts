import { Component, NgIterable, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../services/datos-usuario.service';
import { DatosUsuarioActual } from '../../../../assets/models/datos-usuario.model';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html'
})
export class TransaccionesComponent implements OnInit {
  transacciones: NgIterable<any> | null | undefined;

  constructor(private datosUsuarioService: DatosUsuarioService) { }

  ngOnInit() {
    this.datosUsuarioService.getDatosUsuario().subscribe(datos => {
      this.transacciones = datos.transacciones as unknown as NgIterable<any>;
    });
  }
}