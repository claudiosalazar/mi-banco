import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SegurosUsuario } from '../../shared/models/seguros-usuario.model';
import { map } from 'rxjs/operators';
//import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SegurosUsuarioService {

  //private baseUrl = 'http://localhost:3000/backend/data/seguros-usuario.json';
  baseUrl = 'http://localhost:3000';


  seguros: any[] = [];

  constructor(
    private http: HttpClient
  ) { }

  getSegurosUsuario(): Observable<any> {
    return this.http.get<SegurosUsuario>(this.baseUrl + '/backend/data/seguros-usuario.json').pipe(
      map(response => {
        return response.seguros;
      })
    );
  }

}
