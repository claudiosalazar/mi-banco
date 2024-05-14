import { Component, OnInit } from '@angular/core';

// Services
import { ProductosUsuarioService } from '../../../../core/services/productos-usuario.service';
import { DatosUsuarioService } from '../../../../core/services/datos-usuario.service';
import { BackdropService } from '../../../../core/services/backdrop.service';

// Models
import { DatosUsuarioActual } from '../../../../shared/models/datos-usuario.model';

@Component({
  selector: 'app-visa-comprobante',
  templateUrl: './visa-comprobante.component.html'
})
export class VisaComprobanteComponent implements OnInit{

  datosUsuarioActual: DatosUsuarioActual | undefined;
  email: string | undefined;
  datosUsuario: any;

  productosUsuario: { productos: any[] } = { productos: [] };
  numeroVisa: string | undefined;
  abono: any;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private productosUsuarioService: ProductosUsuarioService,
    private backdropService: BackdropService
  ) { }

  ngOnInit() {
    this.getDatosUsuario();
    this.getProductosUsuarioResumen('2'); 
    this.backdropService.hide();
  }

  getDatosUsuario(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
      this.email = this.datosUsuarioActual.datosUsuario.email;
    });
  }

  getProductosUsuarioResumen(id: any): void {
    this.productosUsuarioService.getProductosUsuarioResumen(id).subscribe(
      data => {
        const producto = data.productos.find(producto => producto.id === '2');
        if (producto) {
          this.numeroVisa = producto.productoNumero;
          const ultimaTransaccion = producto.transacciones[producto.transacciones.length - 1];
          if (ultimaTransaccion) {
            this.abono = parseFloat(ultimaTransaccion.abono);
            console.log(this.abono); // Imprime el valor de abono en la consola
          }
        }
      }
    );
  }

}
