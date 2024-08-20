import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProductosService } from '../../../../services/productos.service';
import { Productos } from '../../../../models/productos.model';
import { DatosUsuarioService } from '../../../../services/datosUsuario.service';
import { DatosUsuario } from '../../../../models/datos-usuario.model';
import { TransaccionesService } from '../../../../services/transacciones.service';
import { CuentaCorriente } from '../../../../models/cuenta-corriente.model';
import { LineaCredito } from '../../../../models/linea-credito.model';
import { Visa } from '../../../../models/visa.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  productos: Productos[] = [];
  transaccionesCtaCte: CuentaCorriente[] = [];
  transaccionesLineaCre: LineaCredito[] = [];
  transaccionesVisa: Visa[] = [];

  // Variables para mostrar tablas de últimas transacciones
  ultimasTransaccionesCtaCte = true;
  ultimasTransaccionesLineaCredito = false;
  ultimasTransaccionesVisa = false;

  primer_nombre: any;
  apellido_paterno: any;

  isActiveCtaCte = true;
  isActiveLineaCredito = false;
  isActiveVisa = false;

  // Variables para almacenar el saldo de la última transacción
  saldoUltimaTransaccionCtaCte: number | null = null;
  saldoUltimaTransaccionLineaCredito: number | null = null;
  saldoUltimaTransaccionVisa: number | null = null;
  
  constructor(
    private productosService: ProductosService,
    private datosUsuarioService: DatosUsuarioService,
    private transaccionesService: TransaccionesService
  ) { }

  ngOnInit() {
    this.productosService.getProductos().subscribe((productos: Productos[]) => {
      if (productos) {
        this.productos = productos;
      }
    });

    const idUser = localStorage.getItem('id_user') || '';
    if (idUser) {
      const idUserNumber = Number(idUser); // Convertir a número
      this.datosUsuarioService.getDatosUsuario(idUserNumber).subscribe((datos: DatosUsuario[]) => {
        if (datos.length > 0) {
          const usuario = datos[0];
          this.primer_nombre = usuario.primer_nombre;
          this.apellido_paterno = usuario.apellido_paterno;
        }
      });
    } else {
      console.error('No se encontró id_user en el localStorage');
    }

    this.transaccionesService.getTransCuentaCorriente().subscribe((transaccionesCtaCte: CuentaCorriente[]) => {
      if (transaccionesCtaCte) {
        this.transaccionesCtaCte = transaccionesCtaCte;
        this.transaccionesCtaCte.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.saldoUltimaTransaccionCtaCte = this.transaccionesCtaCte.length > 0 ? this.transaccionesCtaCte[0].saldo : null;
      }
    });
  
    this.transaccionesService.getTransLineaCredito().subscribe((transaccionesLineaCre: LineaCredito[]) => {
      if (transaccionesLineaCre) {
        this.transaccionesLineaCre = transaccionesLineaCre;
        this.transaccionesLineaCre.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.saldoUltimaTransaccionLineaCredito = this.transaccionesLineaCre.length > 0 ? this.transaccionesLineaCre[0].saldo : null;
      }
    });
  
    this.transaccionesService.getTransVisa().subscribe((transaccionesVisa: Visa[]) => {
      if (transaccionesVisa) {
        this.transaccionesVisa = transaccionesVisa;
        this.transaccionesVisa.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.saldoUltimaTransaccionVisa = this.transaccionesVisa.length > 0 ? this.transaccionesVisa[0].saldo : null;
      }
    });
  }

  getTransaccionesCtaCte() {
    return this.transaccionesCtaCte
      .sort((a, b) => b.id_trans_cta_cte - a.id_trans_cta_cte) // Ordenar por ID en orden descendente
      .slice(0, 3); // Tomar las primeras 3 transacciones
  }
  
  getTransaccionesLineaCredito() {
    return this.transaccionesLineaCre
      .sort((a, b) => b.id_trans_linea_cre - a.id_trans_linea_cre)
      .slice(0, 3);
  }
  
  getTransaccionesVisa() {
    return this.transaccionesVisa
      .sort((a, b) => b.id_trans_visa - a.id_trans_visa)
      .slice(0, 3);
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