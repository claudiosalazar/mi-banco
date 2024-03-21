import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendaDestinatariosService {

  private baseUrl = 'http://localhost:3000/backend/data/agenda-usuarios-transferencias.json';

  constructor(private http: HttpClient) { }

  getDestinatarios(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
}