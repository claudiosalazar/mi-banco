import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ofertas } from '../models/ofertas.model';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {

  //private apiUrl = 'http://localhost:3000';
  private apiUrl = 'https://claudiosalazar.cl/mi-banco';

  constructor(private http: HttpClient) { }

  getOfertas(): Observable<Ofertas[]> {
    return this.http.get<Ofertas[]>(`${this.apiUrl}/mibanco/ofertas`);
  }
}