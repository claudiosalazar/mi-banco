import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartolasHistoricasService {

  constructor(
    private http: HttpClient
  ) { }

  getCartolasHistoricas(): Observable<any> {
    const observable = this.http.get('http://localhost:3000/backend/data/cartolas-historicas.json');
    observable.subscribe(data => {
      console.log('Datos de cartolas históricas:', data);
    }, error => {
      console.error('Error al obtener los datos de cartolas históricas:', error);
    });
    return observable;
  }
}