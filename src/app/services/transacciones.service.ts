import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
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

    guardarNuevaTransferencia() {
      
    }

    /*guardarNuevaTransferencia(nuevaTransferencia: CuentaCorriente, montoATransferir: number): Observable<CuentaCorriente> {
      // Obtener el último saldo de la base de datos
      return this.http.get<CuentaCorriente[]>(`${this.apiUrl}/mibanco/transacciones/cuenta-corriente`).pipe(
        map(transacciones => {
          // Ordenar las transacciones por fecha descendente y obtener la más reciente
          const ultimaTransaccion = transacciones.sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
          return {
            ultimoSaldo: ultimaTransaccion.saldo,
            nuevoId: transacciones.length + 1 // Asignar un nuevo ID basado en la longitud de las transacciones
          };
        }),
        map(({ ultimoSaldo, nuevoId }) => {
          // Restar el monto a transferir del último saldo
          const nuevoSaldo = ultimoSaldo - montoATransferir;
          // Asignar el nuevo saldo y el nuevo ID a la nueva transferencia
          nuevaTransferencia.saldo = nuevoSaldo;
          nuevaTransferencia.id_trans_cta_cte = nuevoId;
          return nuevaTransferencia;
        }),
        // Guardar la nueva transferencia en la base de datos
        switchMap(nuevaTrans => this.http.post<CuentaCorriente>(`${this.apiUrl}/mibanco/transacciones/cuenta-corriente`, nuevaTrans)),
        tap(response => {
          console.log('Nueva transferencia guardada:', response);
        }),
        catchError(error => {
          console.error('Error al guardar la nueva transferencia:', error);
          return throwError(error);
        })
      );
    }*/
}