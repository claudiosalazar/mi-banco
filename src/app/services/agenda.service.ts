import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Agenda } from '../models/agenda.model';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  private apiUrl = 'http://localhost:3000';

  private datosFiltradosSource = new Subject<any[]>();
  private idSource = new BehaviorSubject<number | null>(null);

  private destinatarioActualizado = new BehaviorSubject<void>(undefined);
  destinatarioActualizado$ = this.destinatarioActualizado.asObservable();

  private destinatarioAgregado = new BehaviorSubject<void>(undefined);
  destinatarioAgregado$ = this.destinatarioAgregado.asObservable();

  private datosNuevoDestinatarioSource = new Subject<any>();
  nuevoDestinatarioGuardado = new Subject<void>();

  currentId = this.idSource.asObservable();
  datosFiltrados$ = this.datosFiltradosSource.asObservable();
  paginationData = new Subject<{ itemsPerPage: number, currentPage: number }>();
  paginationData$ = this.paginationData.asObservable();
  id: any;

  destinatarioEliminado = new Subject<any>();

  private idDestinatarioAeditarSource = new BehaviorSubject(null);
  idDestinatarioAeditar = this.idDestinatarioAeditarSource.asObservable();
  datosEditadosDestinatario = new Subject<any>();

  constructor(private http: HttpClient) { }

  getAgenda(): Observable<Agenda[]> {
    return this.http.get<Agenda[]>(`${this.apiUrl}/mibanco/agenda`).pipe(
      map(agenda => agenda.sort((a, b) => a.nombre.localeCompare(b.nombre)))
    );
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
    return this.http.get<any>(`${this.apiUrl}/mibanco/agenda/${id}`);
  }

  emitirDatosNuevoDestinatario(datos: any): void {
    if (datos !== undefined) {
      console.log('Datos recibidos en emitirDatosNuevoDestinatario:', datos);
      this.datosNuevoDestinatarioSource.next(datos);
    }
  }

  getDatosNuevoDestinatario(): Observable<any> {
    return this.datosNuevoDestinatarioSource.asObservable();
  }

  guardarNuevoDestinatario(agenda: Agenda): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/mibanco/agenda`, agenda).pipe(
      tap(() => this.destinatarioAgregado.next())
    );
  }

  actualizarIdDestinatario(id: number, agenda: Agenda): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/mibanco/agenda/${id}`, agenda).pipe(
      tap(() => this.destinatarioActualizado.next())
    );
  }
  
  eliminarIdDestinatario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/mibanco/agenda/${id}`);
  }
}