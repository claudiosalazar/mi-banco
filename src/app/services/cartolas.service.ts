import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cartolas } from '../models/cartolas.model';

@Injectable({
  providedIn: 'root'
})
export class CartolasService {

  //private apiUrl = 'http://localhost:3000';
  private apiUrl = 'https://mi-banco.claudiosalazar.cl';

  constructor(private http: HttpClient) { }

  getCartolas(): Observable<Cartolas[]> {
    return this.http.get<Cartolas[]>(`${this.apiUrl}/mibanco/cartolas`);
  }

}
