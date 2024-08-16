import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { CuentaCorriente } from '../models/cuenta-corriente.model';
import { LineaCredito } from '../models/linea-credito.model';
import { Visa } from '../models/visa.model';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {
  //private apiUrl = 'http://localhost:3000';
private apiUrl = 'https://claudiosalazar.cl/mi-banco';

  constructor(private http: HttpClient) { }

  getTransCuentaCorrienteTransferencia(): Observable<CuentaCorriente[]> {
    return this.http.get<CuentaCorriente[]>(`${this.apiUrl}/mibanco/transacciones/cuenta-corriente`).pipe(
      map(transacciones => 
        transacciones
          .filter(transaccion => transaccion.transferencia === 1) // Filtrar las transacciones con transferencia = 1
          .sort((a, b) => b.fecha.localeCompare(a.fecha))
      ),
      tap(transacciones => {
        console.log('Transacciones filtradas y ordenadas:', transacciones); // Log de las transacciones
        transacciones.forEach(trans => trans.nombre_producto_trans = 'Cuenta Corriente');
      })
    );
  }

  getTransCuentaCorriente(): Observable<CuentaCorriente[]> {
    return this.http.get<CuentaCorriente[]>(`${this.apiUrl}/mibanco/transacciones/cuenta-corriente`).pipe(
      map(transacciones => transacciones.sort((a, b) => b.fecha.localeCompare(a.fecha))),
      tap(transacciones => transacciones.forEach(trans => trans.nombre_producto_trans = 'Cuenta Corriente'))
    );
  }

  getTransLineaCredito(): Observable<LineaCredito[]> {
    return this.http.get<LineaCredito[]>(`${this.apiUrl}/mibanco/transacciones/linea-credito`).pipe(
      map(transacciones => transacciones.sort((a, b) => b.fecha.localeCompare(a.fecha))),
      tap(transacciones => transacciones.forEach(trans => trans.nombre_producto_trans = 'Línea de Crédito'))
    );
  }

  getTransVisa(): Observable<Visa[]> {
    return this.http.get<Visa[]>(`${this.apiUrl}/mibanco/transacciones/visa`).pipe(
      map(transacciones => transacciones.sort((a, b) => b.fecha.localeCompare(a.fecha))),
      tap(transacciones => transacciones.forEach(trans => trans.nombre_producto_trans = 'Visa'))
    );
  }

  filtrarTransacciones(transacciones: (CuentaCorriente | LineaCredito | Visa)[], valorBusqueda: string): (CuentaCorriente | LineaCredito | Visa)[] {
    const valorBusquedaLower = valorBusqueda.toLowerCase();
    return transacciones.filter(transaccion => {
      const fecha = transaccion.fecha ? String(transaccion.fecha).toLowerCase() : '';
      const nombre_destinatario = 'nombre_destinatario' in transaccion ? String(transaccion.nombre_destinatario).toLowerCase() : '';
      const nombre_producto_trans = transaccion.nombre_producto_trans ? String(transaccion.nombre_producto_trans).toLowerCase() : '';
      const detalle = transaccion.detalle ? String(transaccion.detalle).toLowerCase() : '';
      const cargo = transaccion.cargo ? String(transaccion.cargo).toLowerCase() : '';
      const abono = transaccion.abono ? String(transaccion.abono).toLowerCase() : '';
      const saldo = transaccion.saldo ? String(transaccion.saldo).toLowerCase() : '';

      return fecha.includes(valorBusquedaLower) ||
              nombre_destinatario.includes(valorBusquedaLower) ||
              nombre_producto_trans.includes(valorBusquedaLower) ||
              detalle.includes(valorBusquedaLower) ||
              cargo.includes(valorBusquedaLower) ||
              abono.includes(valorBusquedaLower) ||
              saldo.includes(valorBusquedaLower);
    });
  }

  filtrarTransferencias(transacciones: (CuentaCorriente | LineaCredito)[], valorBusqueda: string): (CuentaCorriente | LineaCredito)[] {
    const valorBusquedaLower = valorBusqueda.toLowerCase();
    return transacciones.filter(transaccion => {
      // Verificar si la transacción tiene el valor 1 en la columna transferencia
      if (transaccion.transferencia !== 1) {
        return false;
      }

      const fecha = transaccion.fecha ? String(transaccion.fecha).toLowerCase() : '';
      const nombre_destinatario = 'nombre_destinatario' in transaccion ? String(transaccion.nombre_destinatario).toLowerCase() : '';
      const rut_destinatario = transaccion.rut_destinatario ? String(transaccion.rut_destinatario).toLowerCase() : '';
      const mensaje = transaccion.mensaje ? String(transaccion.mensaje).toLowerCase() : '';
      const cargo = transaccion.cargo ? String(transaccion.cargo).toLowerCase() : '';

      return fecha.includes(valorBusquedaLower) ||
              nombre_destinatario.includes(valorBusquedaLower) ||
              rut_destinatario.includes(valorBusquedaLower) ||
              mensaje.includes(valorBusquedaLower) ||
              cargo.includes(valorBusquedaLower);
    });
}

  
  // Function para guardar transferencias
  guardarNuevaTransferencia(datosTransferencia: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/mibanco/transacciones/cuenta-corriente`, datosTransferencia).pipe(
      tap(() => console.log('Transferencia guardada correctamente'))
    );
  }

  // Function para guardar transacciones
  guardarNuevaTransaccionCtaCte(datosTransaccionCtaCte: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/mibanco/transacciones/cuenta-corriente`, datosTransaccionCtaCte).pipe(
      tap(() => console.log('Transferencia guardada correctamente'))
    );
  }

  guardarNuevaTransaccionLineaCredito(datosTransaccionLineaCredito: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/mibanco/transacciones/linea-credito`, datosTransaccionLineaCredito).pipe(
      tap(() => console.log('transaccion guardada correctamente'))
    );
  }

  guardarNuevaTransaccionVisa(datosTransaccionVisa: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/mibanco/transacciones/visa`, datosTransaccionVisa).pipe(
      tap(() => {
        console.log('Transacción de pago de Visa guardada correctamente');
      })
    );
  }
}