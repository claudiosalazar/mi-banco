import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Cartolas } from '../models/cartolas.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartolasService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCartolas(id_user: number): Observable<Cartolas[]> {
    const params = new HttpParams().set('id_user', id_user.toString());

    return this.http.get<Cartolas[]>(`${this.apiUrl}/mibanco/cartolas`, { params }).pipe(
      tap(cartolas => {
        cartolas.forEach(cartola => {
          // console.log('id_cartola:', cartola.id_cartola);
        });
      }),
      catchError(error => {
        console.error('Error al obtener las cartolas:', error);
        throw error; // Re-lanzar el error para que pueda ser manejado por el componente
      })
    );
  }
}