import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../../services/productos.service';
import { Productos } from '../../../../models/productos.model';
import { DatosUsuarioService } from '../../../../services/datosUsuario.service';
import { DatosUsuario } from '../../../../models/datos-usuario.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  productos: Productos[] = [];
  ultimasTransaccionesCtaCte = true;
  ultimasTransaccionesLineaCredito = false;
  ultimasTransaccionesVisa = false;

  primer_nombre: any;
  apellido_paterno: any;

  isActiveCtaCte = true;
  isActiveLineaCredito = false;
  isActiveVisa = false;
  
  constructor(
    private productosService: ProductosService,
    private datosUsuarioService: DatosUsuarioService
  ) { }

  ngOnInit() {
    this.productosService.getSeguros().subscribe((productos: Productos[]) => {
      if (productos) {
        this.productos = productos;
      }
    });

    this.datosUsuarioService.getDatosUsuario().subscribe((datos: DatosUsuario[]) => {
      if (datos.length > 0) {
        const usuario = datos[0];
        this.primer_nombre = usuario.primer_nombre;
        this.apellido_paterno = usuario.apellido_paterno;
      }
    });
  }

  mostrarTransaccionesCtaCte(): void {
    this.ultimasTransaccionesCtaCte = true;
    this.ultimasTransaccionesLineaCredito = false;
    this.ultimasTransaccionesVisa = false;
    this.isActiveCtaCte = true;
    this.isActiveLineaCredito = false;
    this.isActiveVisa = false;
  }

  mostrarTransaccionesLineaCredito(): void {
    this.ultimasTransaccionesCtaCte = false;
    this.ultimasTransaccionesLineaCredito = true;
    this.ultimasTransaccionesVisa = false;
    this.isActiveCtaCte = false;
    this.isActiveLineaCredito = true;
    this.isActiveVisa = false;
  }

  mostrarTransaccionesVisa(): void {
    this.ultimasTransaccionesCtaCte = false;
    this.ultimasTransaccionesLineaCredito = false;
    this.ultimasTransaccionesVisa = true;
    this.isActiveCtaCte = false;
    this.isActiveLineaCredito = false;
    this.isActiveVisa = true;
  }
}
