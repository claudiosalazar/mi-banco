import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, of, throwError } from 'rxjs';
import { Destinatario } from '../../shared/models/destinatarios.model';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AgendaDestinatariosService {

  private baseUrl = 'http://localhost:3000/backend/data/agenda-usuarios-transferencias.json';

  private destinatarioSource = new BehaviorSubject(null);
  currentDestinatario = this.destinatarioSource.asObservable();

  private datosNuevoDestinatarioSource = new Subject<any>();
  datosNuevoDestinatario = this.datosNuevoDestinatarioSource.asObservable();

  private idDestinatarioAeditarSource = new BehaviorSubject(null);
  idDestinatarioAeditar = this.idDestinatarioAeditarSource.asObservable();

  nuevoDestinatarioGuardado = new Subject<void>();

  constructor(
    private http: HttpClient
  ) { }

  getDestinatarios(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  actualizarIdDestinatarioAeditar(id: any): void {
    this.idDestinatarioAeditarSource.next(id);
  }

  getDestinatarioPorId(id: any): Observable<Destinatario> {
    return this.getDestinatarios().pipe(
      map(destinatarios => destinatarios.find((destinatario: { id: any; }) => destinatario.id === id)),
      catchError(error => {
        console.error('Error al obtener los datos del destinatario:', error);
        return throwError(error);
      })
    );
  }

  emitirDatosNuevoDestinatario(datos: any): void {
    if (datos !== undefined) {
      this.datosNuevoDestinatarioSource.next(datos);
    }
  }

  getDatosNuevoDestinatario(): Observable<any> {
    return this.datosNuevoDestinatarioSource.asObservable();
  }

  guardarNuevoDestinatario(datos: any): Observable<any> {
    return this.http.put(this.baseUrl, datos, {responseType: 'text'}).pipe(
      map((res: any) => {
        return of(datos);
      }),
      catchError(error => {
        console.error('Error del server:', error);
        return throwError(error);
      })
    );
  }

}