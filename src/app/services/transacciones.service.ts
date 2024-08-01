import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Transacciones } from '../models/transacciones.model';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  private URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getTransacciones(): Observable<Transacciones[]> {
    return this.http.get<Transacciones[]>(`${this.URL}/mibanco/transacciones`);
  }

}

export class DatosFiltradosService {
  private datosFiltradosSource = new Subject<any[]>();
  datosFiltrados$ = this.datosFiltradosSource.asObservable();
  paginationData = new Subject<{ itemsPerPage: number, currentPage: number }>();
  paginationData$ = this.paginationData.asObservable();

  actualizarDatosFiltrados(datosFiltrados: any[]) {
    this.datosFiltradosSource.next(datosFiltrados);
    this.paginationData.next({ itemsPerPage: 5, currentPage: 1 });
  }
}