import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductosUsuarioService } from '../../../../core/services/productos-usuario.service';
import { DatosFiltradosService } from '../../../../core/services/productos-usuario.service';
import { FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-buscador-tabla',
  templateUrl: './buscador-tabla.component.html'
})
export class BuscadorTablaComponent implements OnInit {

  @Output() datosFiltradosEvent = new EventEmitter<any[]>();
  
  id: any | undefined;
  paginatedData: any[] | undefined;
  valorBusqueda: any | undefined;
  campoBusqueda = new FormControl('');

  constructor(
    private productosUsuarioService: ProductosUsuarioService,
    private datosFiltradosService: DatosFiltradosService,
    ) {}

  ngOnInit() {
    combineLatest([
      this.campoBusqueda.valueChanges,
      this.productosUsuarioService.getIdActual()
    ]).subscribe(([valorBusqueda, idActual]) => {
      this.valorBusqueda = valorBusqueda;
      this.id = idActual;
  
      this.productosUsuarioService.buscarDatos(this.valorBusqueda || '', this.id).subscribe(datosFiltrados => {
        if (Array.isArray(datosFiltrados)) {
          this.updateTable(datosFiltrados);
        }
      });
    });
  }

  // Nueva función para actualizar la tabla con los datos filtrados
  updateTable(datosFiltrados: any[]) {
    this.paginatedData = datosFiltrados;
    this.datosFiltradosService.actualizarDatosFiltrados(datosFiltrados); // Enviar los datos filtrados
    if (datosFiltrados) {
      console.log('Datos con coincidencias:', datosFiltrados);
    } else {
      console.log('No se encontraron coincidencias');
    }
  }

}
