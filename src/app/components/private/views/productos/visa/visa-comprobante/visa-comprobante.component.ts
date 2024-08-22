import { Component, OnInit } from '@angular/core';
import { Visa } from '../../../../../../models/visa.model';
import { TransaccionesService } from '../../../../../../services/transacciones.service';
import { DatosUsuarioService } from '../../../../../../services/datosUsuario.service';
import { DatosUsuario } from '../../../../../../models/datos-usuario.model';
import { ProductosService } from '../../../../../../services/productos.service';
import { Productos } from '../../../../../../models/productos.model';

@Component({
  selector: 'mb-visa-comprobante',
  templateUrl: './visa-comprobante.component.html'
})
export class VisaComprobanteComponent implements OnInit {

  transaccionesVisa: Visa[] = [];
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
        const producto = productos[2];
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

  obtenerTransaccionMasRecienteConAbono(callback: (ultimoAbono: Visa | null) => void): void {
    const idUser = localStorage.getItem('id_user');
    const idUserNumber = idUser ? parseInt(idUser) : 0; 
    let ultimoAbono: Visa | null = null;

    this.transaccionesService.getTransVisa(idUserNumber).subscribe(transacciones => {
      const transaccionesConAbono = transacciones.filter(transaccion => transaccion.abono !== null && transaccion.abono !== undefined);

      if (transaccionesConAbono.length > 0) {
        ultimoAbono = transaccionesConAbono.reduce((max, transaccion) => {
          return (max === null || transaccion.id_trans_visa > max.id_trans_visa) ? transaccion : max;
        }, null as Visa | null);
      }

      callback(ultimoAbono);
    });
  }

}