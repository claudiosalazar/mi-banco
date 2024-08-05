import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Agenda } from '../models/agenda.model';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  private URL = 'http://localhost:3000';

  private datosFiltradosSource = new Subject<any[]>();
  private idSource = new BehaviorSubject<number | null>(null);
  currentId = this.idSource.asObservable()
  datosFiltrados$ = this.datosFiltradosSource.asObservable();
  paginationData = new Subject<{ itemsPerPage: number, currentPage: number }>();
  paginationData$ = this.paginationData.asObservable();
  id: any;

  private idDestinatarioAeditarSource = new BehaviorSubject(null);
  idDestinatarioAeditar = this.idDestinatarioAeditarSource.asObservable();
  datosEditadosDestinatario = new Subject<any>();

  constructor(private http: HttpClient) { }

  getAgenda(): Observable<Agenda[]> {
    return this.http.get<Agenda[]>(`${this.URL}/mibanco/agenda`);
  }

  filtrarAgenda(valorBusqueda: string): Observable<any[]> {
    return this.getAgenda().pipe(
      map(agenda => agenda.filter((agenda: { nombre: string; apodo: string; rut: string; banco: string; tipo_cuenta: string; numero_cuenta: string; email: string; celular: string; telefono: string; }) =>
        agenda.nombre.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        agenda.apodo.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        agenda.rut.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        agenda.banco.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        agenda.tipo_cuenta.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        agenda.numero_cuenta.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        agenda.email.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        agenda.celular.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        agenda.telefono.toLowerCase().includes(valorBusqueda.toLowerCase())
      ))
    );
  }
  
  actualizarDatosFiltrados(datosFiltrados: any[]) {
    this.datosFiltradosSource.next(datosFiltrados);
    this.paginationData.next({ itemsPerPage: 5, currentPage: 1 });
  }

  getDatosEditadosDestinatario(): Observable<any> {
    return this.datosEditadosDestinatario.asObservable();
  }

  setId(id: number): void {
    console.log('id', id);
    this.idSource.next(id);
  }

  getDestinatarioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.URL}/mibanco/agenda/${id}`);
  }

  
}