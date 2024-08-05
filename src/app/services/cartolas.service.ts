import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cartolas } from '../models/cartolas.model';

@Injectable({
  providedIn: 'root'
})
export class CartolasService {

  private URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getCartolas(): Observable<Cartolas[]> {
    return this.http.get<Cartolas[]>(`${this.URL}/mibanco/cartolas`);
  }

}
