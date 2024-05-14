import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//import { environment } from '../../../environments/environment.prod';



interface CartolaResponse {
  listaCartolas: any[];
}

@Injectable({
  providedIn: 'root'
})
export class CartolasHistoricasService {

  //private baseUrl = 'http://localhost:3000/backend/data/cartolas-historicas.json';
  baseUrl = 'http://localhost:3000';


  constructor(
    private http: HttpClient
  ) { }

  getCartolasHistoricas(): Observable<any> {
    return this.http.get<CartolaResponse>(this.baseUrl + '/backend/data/cartolas-historicas.json').pipe(
      map(response => {
        return response.listaCartolas;
      })
    );
  }
}