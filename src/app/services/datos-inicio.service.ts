import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatosInicio } from '../../assets/models/datos-inicio.model';

@Injectable({
  providedIn: 'root'
})
export class DatosInicioService {

  constructor(private http: HttpClient) { }

  getDatosInicio(): Observable<DatosInicio> {
    return this.http.get<DatosInicio>('assets/data/datos-inicio.json');
  }
}