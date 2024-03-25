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

  constructor(
    private http: HttpClient
  ) { }

  getDestinatarios(): Observable<any> {
    return this.http.get(this.baseUrl);
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