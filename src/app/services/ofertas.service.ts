import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ofertas } from '../models/ofertas.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getOfertas(): Observable<Ofertas[]> {
    return this.http.get<Ofertas[]>(`${this.apiUrl}/mibanco/ofertas`);
  }
}