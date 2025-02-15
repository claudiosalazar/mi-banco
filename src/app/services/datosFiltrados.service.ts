import { Injectable } from '@angular/core';
import { Observable, Subject, forkJoin } from 'rxjs';
import { TransaccionesService } from './transacciones.service';
import { CuentaCorriente } from '../models/cuenta-corriente.model';
import { LineaCredito } from '../models/linea-credito.model';
import { Visa } from '../models/visa.model';

@Injectable({
  providedIn: 'root'
})
export class DatosFiltradosService {
  private datosFiltradosSource = new Subject<any[]>();
  datosFiltrados$ = this.datosFiltradosSource.asObservable();
  paginationData = new Subject<{ itemsPerPage: number, currentPage: number }>();
  paginationData$ = this.paginationData.asObservable();
  
  constructor(
    private transaccionesService: TransaccionesService
  ) { }

  buscarDatos(_idUserNumber: number, valorBusqueda: string): Observable<(CuentaCorriente | LineaCredito | Visa)[]> {
    const idUserNumber = parseInt(localStorage.getItem('id_user') ?? '', 10);
    return new Observable(observer => {
      // Obtener todas las transacciones de los diferentes tipos
      const transaccionesObservables = [
        this.transaccionesService.getTransCuentaCorriente(idUserNumber),
        this.transaccionesService.getTransLineaCredito(idUserNumber),
        this.transaccionesService.getTransVisa(idUserNumber)
      ];

      // Combinar todas las transacciones en un solo array
      forkJoin(transaccionesObservables).subscribe(
        (value: (CuentaCorriente[] | LineaCredito[] | Visa[])[]) => {
          const [cuentaCorriente, lineaCredito, visa] = value;
          const todasTransacciones = [...cuentaCorriente, ...lineaCredito, ...visa];
          const datosFiltrados = this.transaccionesService.filtrarTransacciones(idUserNumber, todasTransacciones, valorBusqueda);
          observer.next(datosFiltrados);
          observer.complete();
        },
        _error => {
          observer.error('Error al obtener transacciones');
        }
      );
    });
  }

  buscarDatosTransferencias(_idUserNumber: number, valorBusqueda: string): Observable<(CuentaCorriente | LineaCredito)[]> {
    const idUserNumber = parseInt(localStorage.getItem('id_user') ?? '', 10);
    return new Observable(observer => {
      // Obtener transacciones de CuentaCorriente y LineaCredito
      const transaccionesObservables = [
        this.transaccionesService.getTransCuentaCorriente(idUserNumber),
        this.transaccionesService.getTransLineaCredito(idUserNumber)
      ];

      // Combinar las transacciones en un solo array
      forkJoin(transaccionesObservables).subscribe(
        (value: (CuentaCorriente[] | LineaCredito[])[]) => {
          const [cuentaCorriente, lineaCredito] = value;
          const todasTransferencias = [...cuentaCorriente, ...lineaCredito];
          const datosFiltrados = this.transaccionesService.filtrarTransferencias(todasTransferencias, valorBusqueda);
          observer.next(datosFiltrados);
          observer.complete();
        },
        _error => {
          observer.error('Error al obtener transacciones');
        }
      );
    });
  }

  actualizarDatosFiltrados(datosFiltrados: any[]) {
    // console.log('Datos filtrados recibidos:', datosFiltrados); // Verifica que los datos se reciben
    this.datosFiltradosSource.next(datosFiltrados);
    this.paginationData.next({ itemsPerPage: 10, currentPage: 1 });
  }
}