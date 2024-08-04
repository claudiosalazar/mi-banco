import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transacciones } from '../models/transacciones.model';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getTransacciones(): Observable<Transacciones[]> {
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
  }
}