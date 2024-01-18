import { Component, OnInit } from '@angular/core';
import { DatosInicio } from 'src/assets/models/datos-inicio.model';
import { DatosInicioService } from 'src/app/services/datos-inicio.service';
import { Observable } from 'rxjs'; // Importa Observable desde 'rxjs'
import { HttpClient } from '@angular/common/http'; // Importa HttpClient desde '@angular/common/http'


@Component({
  selector: 'app-resumen-usuario',
  templateUrl: './resumen-usuario.component.html'
})

export class ResumenUsuarioComponent implements OnInit {
  

  DatosInicio: DatosInicio | undefined;
  


  constructor(private DatosInicioService: DatosInicioService, private http: HttpClient) { }

  ngOnInit() {
    this.getDatosInicio().subscribe(data => {
      this.DatosInicio = this.DatosInicio;
    }); 
  }

  getDatosInicio(): Observable<DatosInicio> {
    return this.http.get<DatosInicio>('../../assets/data/datos-inicio.json');
  }
}