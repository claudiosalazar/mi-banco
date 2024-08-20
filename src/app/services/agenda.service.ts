import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Agenda } from '../models/agenda.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  private apiUrl = environment.apiUrl;

  private datosFiltradosSource = new Subject<any[]>();
  private idSource = new BehaviorSubject<number | null>(null);

  private destinatarioActualizado = new Subject<any>();
  public destinatarioActualizado$ = this.destinatarioActualizado.asObservable();

  private destinatarioAgregado = new BehaviorSubject<void>(undefined);
  destinatarioAgregado$ = this.destinatarioAgregado.asObservable();

  private datosNuevoDestinatarioSource = new Subject<any>();
  nuevoDestinatarioGuardado = new Subject<void>();

  currentId = this.idSource.asObservable();
  datosFiltrados$ = this.datosFiltradosSource.asObservable();
  paginationData = new Subject<{ itemsPerPage: number, currentPage: number }>();
  paginationData$ = this.paginationData.asObservable();
  id_agenda: number | undefined;

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

  filtrarAgenda(valorBusqueda: any): Observable<Agenda[]> {
    const searchStr = String(valorBusqueda).toLowerCase().replace(/\s+/g, '');
    return this.getAgenda().pipe(
      map(agenda => agenda.filter((item: any) => 
        Object.values(item).some(value => 
          String(value).toLowerCase().replace(/\s+/g, '').includes(searchStr)
        )
      ))
    );
  }
  
  actualizarDatosFiltrados(datosFiltrados: any[]) {
    this.datosFiltradosSource.next(datosFiltrados);
    this.paginationData.next({ itemsPerPage: 5, currentPage: 1 });
  }

  setId(id_agenda: number): void {
    this.idSource.next(id_agenda);
  }

  getDestinatarioById(id_agenda: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/mibanco/agenda/${id_agenda}`);
  }

  emitirDatosNuevoDestinatario(datos: any): void {
    if (datos !== undefined) {
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

  guardarDestinatarioEditado(id_agenda: number, agenda: Agenda): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/mibanco/agenda/${id_agenda}`, agenda).pipe(
        tap((value) => this.destinatarioActualizado.next(value))
      );
  }

  actualizarDestinatario(datosEditados: any) {
    console.log('Emitiendo datos editados:', datosEditados);
    this.destinatarioActualizado.next(datosEditados);
  }
  
  eliminarIdDestinatario(id_agenda: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/mibanco/agenda/${id_agenda}`);
  }
}