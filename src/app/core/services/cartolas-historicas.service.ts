import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface CartolaResponse {
  listaCartolas: any[];
}

@Injectable({
  providedIn: 'root'
})
export class CartolasHistoricasService {

  listaCartolas: any;

  private baseUrl = 'http://localhost:3000/backend/data/cartolas-historicas.json';

  constructor(
    private http: HttpClient
  ) { }

  getCartolasHistoricas(): Observable<any> {
    return this.http.get<CartolaResponse>(this.baseUrl).pipe(
      map(response => {
        //console.log(JSON.stringify(response, null, 2)); // Imprime los datos que se están enviando en formato JSON
        return response.listaCartolas; // Devuelve el array 'listaCartolas'
      })
    );
  }
}