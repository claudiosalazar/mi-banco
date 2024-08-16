import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cartolas } from '../models/cartolas.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartolasService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCartolas(): Observable<Cartolas[]> {
    return this.http.get<Cartolas[]>(`${this.apiUrl}/mibanco/cartolas`);
  }

}
