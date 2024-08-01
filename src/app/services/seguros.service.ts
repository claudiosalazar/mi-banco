import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Seguros } from '../models/seguros.model';

@Injectable({
  providedIn: 'root'
})
export class SegurosService {

  private URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getSeguros(): Observable<Seguros[]> {
    return this.http.get<Seguros[]>(`${this.URL}/mibanco/seguros`);
  }
}