import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Localidades } from '../models/localidades.model';

@Injectable({
  providedIn: 'root'
})
export class LocalidadesService {

  //private apiUrl = 'http://localhost:3000';
  private apiUrl = 'https://mi-banco.claudiosalazar.cl';

  constructor(private http: HttpClient) { }

  getCiudades(): Observable<Localidades[]> {
    return this.http.get<Localidades[]>(`${this.apiUrl}/mibanco/localidades/ciudades`);
  }

  getComunas(): Observable<Localidades[]> {
    return this.http.get<Localidades[]>(`${this.apiUrl}/mibanco/localidades/comunas`);
  }

  getRegiones(): Observable<Localidades[]> {
    return this.http.get<Localidades[]>(`${this.apiUrl}/mibanco/localidades/regiones`);
  }
}