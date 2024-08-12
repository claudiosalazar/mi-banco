import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, switchMap, tap, throwError } from 'rxjs';
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
    return this.http.get<CuentaCorriente[]>(`${this.apiUrl}/mibanco/transacciones/cuenta-corriente`).pipe(
      map(transacciones => transacciones.sort((a, b) => b.fecha.localeCompare(a.fecha))),
      tap(transacciones => transacciones.forEach(trans => trans.nombre_producto_trans = 'Cuenta Corriente'))
    );
  }

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

  // Function para guardar transacciones

  guardarNuevaTransferencia(datosTransferencia: any): Observable<any> {
    console.log('Datos de transferencia capturados:', datosTransferencia); // Verificar datos capturados
    return this.http.post<any>(`${this.apiUrl}/mibanco/transacciones/cuenta-corriente`, datosTransferencia).pipe(
      tap(() => console.log('Transferencia guardada correctamente'))
    );
  }

  guardarNuevaTransaccionCtaCte(datosTransaccionCtaCte: any): Observable<any> {
    console.log('Datos de transaccion capturados:', datosTransaccionCtaCte); // Verificar datos capturados
    return this.http.post<any>(`${this.apiUrl}/mibanco/transacciones/cuenta-corriente`, datosTransaccionCtaCte).pipe(
      tap(() => console.log('Transferencia guardada correctamente'))
    );
  }

  guardarNuevaTransaccionLineaCredito(datosTransaccionLineaCredito: any): Observable<any> {
    console.log('Datos de transaccion capturados:', datosTransaccionLineaCredito); // Verificar datos capturados
    return this.http.post<any>(`${this.apiUrl}/mibanco/transacciones/linea_credito`, datosTransaccionLineaCredito).pipe(
      tap(() => console.log('transaccion guardada correctamente'))
    );
  }

  guardarPagoVisa(datosPagoVisa: any): Observable<any> {
    console.log('Datos de pago de Visa capturados:', datosPagoVisa); // Verificar datos capturados
  
    // Guardar el pago de Visa
    return this.http.post<any>(`${this.apiUrl}/mibanco/transacciones/visa`, datosPagoVisa).pipe(
      tap(() => {
        console.log('Datos enviados al backend:', datosPagoVisa); // Verificar datos enviados
        console.log('Transacción de pago de Visa guardada correctamente');
      })
    );
  }

    

}