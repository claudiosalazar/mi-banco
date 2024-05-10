import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, of, throwError } from 'rxjs';
import { Destinatario } from '../../shared/models/destinatarios.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AgendaDestinatariosService {

  //private baseUrl = 'http://localhost:3000/backend/data/agenda-usuarios-transferencias.json';
  baseUrl = environment.baseUrl;

  private destinatarioSource = new BehaviorSubject(null);
  currentDestinatario = this.destinatarioSource.asObservable();

  private datosNuevoDestinatarioSource = new Subject<any>();
  datosNuevoDestinatario = this.datosNuevoDestinatarioSource.asObservable();

  private idDestinatarioAeditarSource = new BehaviorSubject(null);
  idDestinatarioAeditar = this.idDestinatarioAeditarSource.asObservable();

  nuevoDestinatarioGuardado = new Subject<void>();
  datosEditadosDestinatario = new Subject<any>();
  destinatarioEliminado = new Subject<any>();
  nuevoDestinatarioId = new Subject<string>();

  ultimoIdDestinatario: any;

  constructor(
    private http: HttpClient
  ) { }

  getDestinatarios(): Observable<any> {
    return this.http.get(this.baseUrl + '/backend/data/agenda-usuarios-transferencias.json');
  }

  actualizarIdDestinatarioAeditar(id: any): void {
    this.idDestinatarioAeditarSource.next(id);
  }

  // Obtiene los datos del destinatario seleccionado
  getDestinatarioPorId(id: any): Observable<Destinatario> {
    console.log('ID del destinatario:', id);
    this.ultimoIdDestinatario = id; // Almacena el último ID capturado
    return this.getDestinatarios().pipe(
      map(destinatarios => destinatarios.find((destinatario: { id: any; }) => destinatario.id === id)),
      catchError(error => {
        console.error('Error al obtener los datos del destinatario:', error);
        return throwError(error);
      })
    );
  }

  getUltimoIdDestinatario(): any {
    return this.ultimoIdDestinatario;
  }

  // Guarda nuevo destinatario
  emitirDatosNuevoDestinatario(datos: any): void {
    if (datos !== undefined) {
      this.datosNuevoDestinatarioSource.next(datos);
    }
  }

  getDatosNuevoDestinatario(): Observable<any> {
    return this.datosNuevoDestinatarioSource.asObservable();
  }

  guardarNuevoDestinatario(datos: any): Observable<any> {
    return this.http.put(this.baseUrl + '/backend/data/agenda-usuarios-transferencias.json', datos, {responseType: 'text'}).pipe(
      map((res: any) => {
        return of(datos);
      }),
      catchError(error => {
        console.error('Error del server:', error);
        return throwError(error);
      })
    );
  }

  // Guarda los datos editados del destinatario
  emitirDatosEditadosDestinatario(datos: any): void {
    this.datosEditadosDestinatario.next(datos);
    console.log('Datos editados del destinatario:', datos);
  }
  // Crea la función getDatosEditadosDestinatario
  getDatosEditadosDestinatario(): Observable<any> {
    return this.datosEditadosDestinatario.asObservable();
  }
  guardarDestinatarioEditado(id: string, datosEditados: any): Observable<any> {
    console.log('Datos enviados al server:', datosEditados);
    return this.http.put(`${this.baseUrl + '/backend/data/agenda-usuarios-transferencias.json'}/${id}`, datosEditados).pipe(
      map((res: any) => {
        console.log('Datos recibidos del server:', res);
        return res;
      }),
      catchError(error => {
        console.error('Error del server:', error);
        return throwError(error);
      })
    );
  }

  // Eliminia un destinatario
  eliminarDestinatarioServer(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl + '/backend/data/agenda-usuarios-transferencias.json'}?id=${id}`, {responseType: 'text'}).pipe(
      catchError(error => {
        console.error('Error del server:', error);
        return throwError(error);
      })
    );
  }

  // Buscador
  filtrarDestinatarios(valorBusqueda: string): Observable<any[]> {
    return this.getDestinatarios().pipe(
      map(destinatarios => destinatarios.filter((destinatario: { nombre: string; apodo: string; rut: string; banco: string; tipoCuenta: string; numeroCuenta: string; email: string; celular: string; telefono: string; }) =>
        destinatario.nombre.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        destinatario.apodo.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        destinatario.rut.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        destinatario.banco.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        destinatario.tipoCuenta.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        destinatario.numeroCuenta.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        destinatario.email.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        destinatario.celular.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        destinatario.telefono.toLowerCase().includes(valorBusqueda.toLowerCase())
      ))
    );
  }

}