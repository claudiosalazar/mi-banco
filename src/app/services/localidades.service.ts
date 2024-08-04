import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Localidades } from '../models/localidades.model';

@Injectable({
  providedIn: 'root'
})
export class LocalidadesService {

  private URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getCiudades(): Observable<Localidades[]> {
    return this.http.get<Localidades[]>(`${this.URL}/mibanco/localidades/ciudades`);
  }

  getComunas(): Observable<Localidades[]> {
    return this.http.get<Localidades[]>(`${this.URL}/mibanco/localidades/comunas`);
  }

  getRegiones(): Observable<Localidades[]> {
    return this.http.get<Localidades[]>(`${this.URL}/mibanco/localidades/regiones`);
  }
}