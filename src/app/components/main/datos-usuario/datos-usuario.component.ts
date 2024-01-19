import { Component } from '@angular/core';
import { DatosUsuarioService } from '../../../services/datos-usuario.service';
import { DatosUsuario } from '../../../../assets/models/datos-usuario.model';

@Component({
  selector: 'app-datos-usuario',
  templateUrl: './datos-usuario.component.html'
})
export class DatosUsuarioComponent {
  DatosUsuario: DatosUsuario | undefined;

  constructor(private datosUsuarioService: DatosUsuarioService) { }

  ngOnInit() {
    this.getDatosUsuario();
  }

  getDatosUsuario(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(data => {
      this.DatosUsuario = data;
      console.log(this.DatosUsuario);
    }); 
  }

}
