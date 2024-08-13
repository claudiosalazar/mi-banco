import { Component, OnInit } from '@angular/core';
import { Visa } from '../../../../../../models/visa.model';
import { TransaccionesService } from '../../../../../../services/transacciones.service';
import { DatosUsuarioService } from '../../../../../../services/datosUsuario.service';
import { DatosUsuario } from '../../../../../../models/datos-usuario.model';
import { ProductosService } from '../../../../../..//services/productos.service';
import { Productos } from '../../../../../../models/productos.model';

@Component({
  selector: 'mb-visa-comprobante',
  templateUrl: './visa-comprobante.component.html'
})
export class VisaComprobanteComponent implements OnInit {

  transaccionesVisa: Visa[] = [];
  productos: Productos[] = [];
  abonoUltimaTransaccionVisa: number | null = null;
  idDestinatarioUltimaTransaccionCtaCte: any | null = null;
  nombreDestinatarioUltimaTransaccionCtaCte: string | null = null;
  email: any;
  numero_producto: any;

  constructor(
    private transaccionesService: TransaccionesService,
    private datosUsuarioService: DatosUsuarioService,
    private productosService: ProductosService
  ) { }

  ngOnInit() {
    this.productosService.getProductos().subscribe((productos: Productos[]) => {
      if (productos.length > 0) {
        const producto = productos[2];
        this.numero_producto = producto.numero_producto;
      }
    });

    this.datosUsuarioService.getDatosUsuario().subscribe((datos: DatosUsuario[]) => {
      if (datos.length > 0) {
        const usuario = datos[0];
        this.email = usuario.email;
      }
    });
    
    this.transaccionesService.getTransVisa().subscribe((transaccionesVisa: Visa[]) => {
      if (transaccionesVisa) {
        this.transaccionesVisa = transaccionesVisa;
        this.transaccionesVisa.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.abonoUltimaTransaccionVisa = this.transaccionesVisa.length > 0 ? this.transaccionesVisa[0].abono : null;
      }
    });
  }

}