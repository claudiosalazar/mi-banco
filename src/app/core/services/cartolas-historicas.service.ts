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

  private baseUrl = 'http://localhost:3000/backend/data/cartolas-historicas.json';

  constructor(
    private http: HttpClient
  ) { }

  getCartolasHistoricas(): Observable<any> {
    return this.http.get<CartolaResponse>(this.baseUrl).pipe(
      map(response => {
        return response.listaCartolas;
      })
    );
  }
}