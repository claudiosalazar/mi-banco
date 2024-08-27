import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { CuentaCorriente } from '../models/cuenta-corriente.model';
import { LineaCredito } from '../models/linea-credito.model';
import { Visa } from '../models/visa.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {
  
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTransCuentaCorrienteTransferencia(idUserNumber: number): Observable<CuentaCorriente[]> {
    return this.http.get<CuentaCorriente[]>(`${this.apiUrl}/mibanco/transacciones/cuenta-corriente`).pipe(
      map(transacciones => transacciones.filter(transaccion => transaccion.transferencia === 1 && transaccion.id_user === idUserNumber)),
      map(transacciones => transacciones.sort((a, b) => b.fecha.localeCompare(a.fecha))),
      tap(transacciones => {
        transacciones.forEach(trans => trans.nombre_producto_trans = 'Cuenta Corriente');
      })
    );
  }

  getTransCuentaCorriente(idUserNumber: number): Observable<CuentaCorriente[]> {
    return this.http.get<CuentaCorriente[]>(`${this.apiUrl}/mibanco/transacciones/cuenta-corriente`).pipe(
      map(transacciones => transacciones.filter(transaccion => transaccion.id_user === idUserNumber)),
      map(transacciones => transacciones.sort((a, b) => b.fecha.localeCompare(a.fecha))),
      tap(transacciones => transacciones.forEach(trans => trans.nombre_producto_trans = 'Cuenta Corriente'))
    );
  }
  
  getTransLineaCredito(idUserNumber: number): Observable<LineaCredito[]> {
    return this.http.get<LineaCredito[]>(`${this.apiUrl}/mibanco/transacciones/linea-credito`).pipe(
      map(transacciones => transacciones.filter(transaccion => transaccion.id_user === idUserNumber)),
      map(transacciones => transacciones.sort((a, b) => b.fecha.localeCompare(a.fecha))),
      tap(transacciones => transacciones.forEach(trans => trans.nombre_producto_trans = 'Línea de Crédito'))
    );
  }

  // Captura todos los datos sin importar el id_user
  getIdTransCtaCte(): Observable<CuentaCorriente[]> {
    return this.http.get<CuentaCorriente[]>(`${this.apiUrl}/mibanco/transacciones/cuenta-corriente`).pipe(
      map(transacciones => transacciones.sort((a, b) => b.fecha.localeCompare(a.fecha))),
    );
  }

  getIdTransLineaCredito(): Observable<LineaCredito[]> {
    return this.http.get<LineaCredito[]>(`${this.apiUrl}/mibanco/transacciones/linea-credito`).pipe(
      map(transacciones => transacciones.sort((a, b) => b.fecha.localeCompare(a.fecha))),
    );
  }

  getTransVisa(idUserNumber: number): Observable<Visa[]> {
    return this.http.get<Visa[]>(`${this.apiUrl}/mibanco/transacciones/visa`).pipe(
      map(transacciones => transacciones.filter(transaccion => transaccion.id_user === idUserNumber)),
      map(transacciones => transacciones.sort((a, b) => b.fecha.localeCompare(a.fecha))),
      tap(transacciones => transacciones.forEach(trans => trans.nombre_producto_trans = 'Visa'))
    );
  }

  getIdTransVisa(): Observable<Visa[]> {
    return this.http.get<Visa[]>(`${this.apiUrl}/mibanco/transacciones/visa`).pipe(
      map(transacciones => transacciones.sort((a, b) => b.fecha.localeCompare(a.fecha))),
    );
  }

  filtrarTransacciones(_idUserNumber: number, transacciones: (CuentaCorriente | LineaCredito | Visa)[], valorBusqueda: string): (CuentaCorriente | LineaCredito | Visa)[] {
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
    const idUserNumber = parseInt(localStorage.getItem('id_user') ?? '', 10); // O sessionStorage.getItem('id_user')

    return transacciones.filter(transaccion => {
      // Verificar si la transacción tiene el valor 1 en la columna transferencia y coincide con el id_user
      if (transaccion.transferencia !== 1 || transaccion.id_user !== idUserNumber) {
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
  guardarNuevaTransferenciaCtaCte(datosTransferencia: any): Observable<any> {
    const idUser = localStorage.getItem('id_user');
    // Agregar id_user al objeto de datos de transacción
    datosTransferencia.id_user = idUser;
    return this.http.post<any>(`${this.apiUrl}/mibanco/transacciones/cuenta-corriente`, datosTransferencia).pipe(
      tap(() => {})
    );
  }

  guardarNuevaTransferenciaLineaCredito(datosTransferencia: any): Observable<any> {
    const idUser = localStorage.getItem('id_user');
    // Agregar id_user al objeto de datos de transacción
    datosTransferencia.id_user = idUser;

    return this.http.post<any>(`${this.apiUrl}/mibanco/transacciones/linea-credito`, datosTransferencia).pipe(
      tap(() => {})
    );
  }

  // Function para guardar transacciones
  guardarNuevaTransaccionCtaCte(datosTransaccionCtaCte: any): Observable<any> {
    // Obtener el valor de id_user del almacenamiento
    const idUser = localStorage.getItem('id_user');
    // Agregar id_user al objeto de datos de transacción
    datosTransaccionCtaCte.id_user = idUser;
  
    return this.http.post<any>(`${this.apiUrl}/mibanco/transacciones/cuenta-corriente`, datosTransaccionCtaCte).pipe(
      tap(() => {})
    );
  }
  
  guardarNuevaTransaccionLineaCredito(datosTransaccionLineaCredito: any): Observable<any> {
    // Obtener el valor de id_user del almacenamiento
    const idUser = localStorage.getItem('id_user');
    // Agregar id_user al objeto de datos de transacción
    datosTransaccionLineaCredito.id_user = idUser;
  
    return this.http.post<any>(`${this.apiUrl}/mibanco/transacciones/linea-credito`, datosTransaccionLineaCredito).pipe(
      tap(() => {})
    );
  }
  
  guardarNuevaTransaccionVisa(datosTransaccionVisa: any): Observable<any> {
    // Obtener el valor de id_user del almacenamiento
    const idUser = localStorage.getItem('id_user');
    // Agregar id_user al objeto de datos de transacción
    datosTransaccionVisa.id_user = idUser;
  
    return this.http.post<any>(`${this.apiUrl}/mibanco/transacciones/visa`, datosTransaccionVisa).pipe(
      tap(() => {})
    );
  }
}