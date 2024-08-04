import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Transacciones } from '../models/transacciones.model';
import { TransaccionesService } from './transacciones.service';

@Injectable({
  providedIn: 'root'
})
export class DatosFiltradosService {
  private datosFiltradosSource = new Subject<any[]>();
  datosFiltrados$ = this.datosFiltradosSource.asObservable();
  paginationData = new Subject<{ itemsPerPage: number, currentPage: number }>();
  paginationData$ = this.paginationData.asObservable();
  idActual: any;

  constructor(private transaccionesService: TransaccionesService) { }

  getIdActual() {
    return new Observable(observer => {
      observer.next(this.idActual);
      observer.complete();
    });
  }

  buscarDatos(valorBusqueda: string): Observable<Transacciones[]> {
    return new Observable(observer => {
      this.transaccionesService.getTransacciones().subscribe(transacciones => {
        const datosFiltrados = this.transaccionesService.filtrarTransacciones(transacciones, valorBusqueda);
        observer.next(datosFiltrados);
        observer.complete();
      }, error => {
        observer.error('Error al obtener transacciones');
      });
    });
  }

  actualizarDatosFiltrados(datosFiltrados: any[]) {
    console.log('Datos filtrados recibidos:', datosFiltrados); // Verifica que los datos se reciben
    this.datosFiltradosSource.next(datosFiltrados);
    this.paginationData.next({ itemsPerPage: 5, currentPage: 1 });
  }
}