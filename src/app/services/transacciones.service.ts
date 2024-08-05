import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CuentaCorriente } from '../models/cuenta-corriente.model';
import { LineaCredito } from '../models/linea-credito.model';
import { Visa } from '../models/visa.model';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getTransCuentaCorriente(): Observable<CuentaCorriente[]> {
    return this.http.get<CuentaCorriente[]>(`${this.apiUrl}/mibanco/transacciones/cuenta-corriente`);
  }

  getTransLineaCredito(): Observable<LineaCredito[]> {
    return this.http.get<LineaCredito[]>(`${this.apiUrl}/mibanco/transacciones/linea-credito`);
  }

  getTransVisa(): Observable<Visa[]> {
    return this.http.get<Visa[]>(`${this.apiUrl}/mibanco/transacciones/visa`);
  }

  /*getTransacciones(): Observable<Transacciones[]> {
    return this.http.get<Transacciones[]>(`${this.apiUrl}/mibanco/transacciones`);
  }

  filtrarTransacciones(transacciones: Transacciones[], valorBusqueda: any): Transacciones[] {
    const valorBusquedaLower = valorBusqueda.toLowerCase();
    return transacciones.filter(transaccion => {
      const fecha = transaccion.fecha ? String(transaccion.fecha).toLowerCase() : '';
      const nombreProductoTrans = transaccion.nombre_producto_trans ? String(transaccion.nombre_producto_trans).toLowerCase() : '';
      const detalle = transaccion.detalle ? String(transaccion.detalle).toLowerCase() : '';
      const cargo = transaccion.cargo ? String(transaccion.cargo).toLowerCase() : '';
      const abono = transaccion.abono ? String(transaccion.abono).toLowerCase() : '';
      const saldo = transaccion.saldo ? String(transaccion.saldo).toLowerCase() : '';

      return fecha.includes(valorBusquedaLower) ||
             nombreProductoTrans.includes(valorBusquedaLower) ||
             detalle.includes(valorBusquedaLower) ||
             cargo.includes(valorBusquedaLower) ||
             abono.includes(valorBusquedaLower) ||
             saldo.includes(valorBusquedaLower);
    });
  }*/
}