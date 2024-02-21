import { Component } from '@angular/core';
import { DatosUsuarioService } from '../../core/services/datos-usuario.service';
import { DatosUsuarioActual } from '../../shared/models/datos-usuario.model';

@Component({
  selector: 'app-datos-usuario',
  templateUrl: './datos-usuario.component.html'
})
export class DatosUsuarioComponent {
  datosUsuarioActual: DatosUsuarioActual | undefined;

  constructor(private datosUsuarioService: DatosUsuarioService) { }

  ngOnInit() {
    this.getDatosUsuario();
  }

  getDatosUsuario(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
      console.log(this.datosUsuarioActual);
    }); 
  }

}
