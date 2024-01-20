import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistorialTransacciones } from '../../assets/models/historial-transacciones.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialTransaccionesService {
  private url = 'assets/data/transacciones.json';

  constructor(private http: HttpClient) { }

  getTransacciones(): Observable<HistorialTransacciones[]> {
    return this.http.get<HistorialTransacciones[]>(this.url);
  }

  
}