import { Component, OnInit } from '@angular/core';
import { LineaCredito } from './../../../../../../models/linea-credito.model';
import { TransaccionesService } from '../../../../../../services/transacciones.service';
import { DatosUsuarioService } from '../../../../../../services/datosUsuario.service';
import { DatosUsuario } from '../../../../../../models/datos-usuario.model';
import { ProductosService } from '../../../../../../services/productos.service';
import { Productos } from '../../../../../../models/productos.model';

@Component({
  selector: 'mb-linea-credito-comprobante',
  templateUrl: './linea-credito-comprobante.component.html'
})
export class LineaCreditoComprobanteComponent implements OnInit {

  transaccionesLineaCre: LineaCredito[] = [];
  productos: Productos[] = [];
  abono: any;
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
        const producto = productos[1];
        this.numero_producto = producto.numero_producto;
      }
    });

    const idUser = localStorage.getItem('id_user') || '';
    if (idUser) {
      const idUserNumber = Number(idUser); // Convertir a número
      this.datosUsuarioService.getDatosUsuario(idUserNumber).subscribe((datos: DatosUsuario[]) => {
        if (datos.length > 0) {
          const usuario = datos[0];
          this.email = usuario.email;
        }
      });
    } else {
      console.error('No se encontró id_user en el localStorage');
    }

    this.obtenerTransaccionMasRecienteConAbono((ultimoAbono) => {
      if (ultimoAbono) {
        this.abono = ultimoAbono.abono;
      }
    });
  }
  
  obtenerTransaccionMasRecienteConAbono(callback: (ultimoAbono: LineaCredito | null) => void): void {
    let ultimoAbono: LineaCredito | null = null;

    this.transaccionesService.getTransLineaCredito().subscribe(transacciones => {
      const transaccionesConAbono = transacciones.filter(transaccion => transaccion.abono !== null && transaccion.abono !== undefined);

      if (transaccionesConAbono.length > 0) {
        ultimoAbono = transaccionesConAbono.reduce((max, transaccion) => {
          return (max === null || transaccion.id_trans_linea_cre > max.id_trans_linea_cre) ? transaccion : max;
        }, null as LineaCredito | null);
      }

      callback(ultimoAbono);
    });
  }
}