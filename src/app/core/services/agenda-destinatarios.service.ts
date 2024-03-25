import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

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

  guardarNuevoDestinatario(datos: any): Observable<any> {
    console.log('Datos recibidos en guardarNuevoDestinatario:', datos);
    // Aquí puedes hacer lo que necesites con los datos

    // Realiza una solicitud HTTP PUT para guardar los datos
    return this.http.put(this.baseUrl, datos);
  }

}