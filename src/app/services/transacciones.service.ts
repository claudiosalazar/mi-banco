import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Transacciones } from '../models/transacciones.model';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getTransacciones(): Observable<Transacciones[]> {
    return this.http.get<Transacciones[]>(`${this.apiUrl}/mibanco/transacciones`);
  }

}