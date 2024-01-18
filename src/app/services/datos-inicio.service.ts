import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class DatosInicioService {
  getdatosInicio() {
    throw new Error('Method not implemented.');
  }

  private ROOT_URL = '../../assets/data/datos-inicio.json';

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get(`${this.ROOT_URL}`);
  }
  
}