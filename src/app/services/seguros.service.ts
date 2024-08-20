import { HttpClient, HttpParams } from '@angular/common/http';
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
    const idUser = localStorage.getItem('id_user') || '';
    const params = new HttpParams().set('id_user', idUser);
    return this.http.get<Seguros[]>(`${this.apiUrl}/mibanco/seguros`, { params });
  }
}