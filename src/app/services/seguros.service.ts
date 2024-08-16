import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Seguros } from '../models/seguros.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SegurosService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getSeguros(): Observable<Seguros[]> {
    return this.http.get<Seguros[]>(`${this.apiUrl}/mibanco/seguros`);
  }
}