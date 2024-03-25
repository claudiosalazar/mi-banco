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
      // console.log('Datos recibidos desde AgregarDestinatarioComponent:', datos);
      this.datosNuevoDestinatarioSource.next(datos);
      // console.log('Datos emitidos:', datos);
    }
  }

  getDatosNuevoDestinatario(): Observable<any> {
    return this.datosNuevoDestinatarioSource.asObservable();
  }

 /*guardarNuevoDestinatario(datos: Destinatario[]): Observable<any> {
    // Primero, obtener los datos actuales
    return this.http.get(this.baseUrl).pipe(
      switchMap((datosActuales: any) => {
        // Agregar los nuevos datos a los datos actuales
        datos.forEach(dato => {
        datosActuales[dato.id] = dato;
      });
  
        // Mostrar en consola los datos que se enviarán al servidor
        console.log('Datos que se enviarán al servidor:', datosActuales);
  
        // Luego, enviar los datos actualizados al servidor
        return this.http.put(this.baseUrl, datosActuales);
      })
    );
  }*/

  guardarNuevoDestinatario(datos: Destinatario): Observable<any> {
    // Mostrar en consola los datos recibidos del componente
    console.log('Datos recibidos del componente:', datos);
  
    // Obtener los datos actuales
    return this.http.get<Destinatario[]>(this.baseUrl).pipe(
      switchMap((datosActuales: Destinatario[]) => {
        // Agregar los nuevos datos a los datos actuales
        const datosActualizados = [...datosActuales, datos];
  
        // Mostrar en consola los datos que se enviarán al servidor
        console.log('Datos que se enviarán al servidor:', datosActualizados);
  
        // Enviar los datos actualizados al servidor
        return this.http.put(this.baseUrl, datosActualizados, {responseType: 'text'});
      }),
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