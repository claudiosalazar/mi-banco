import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms'
import { ProductosUsuarioService } from 'src/app/core/services/productos-usuario.service';
import { ProductosUsuario } from 'src/app/shared/models/productos-usuario.model';

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html'
})
export class CuentaCorrienteComponent implements OnInit {

  cuentaCorrienteId = '0';
  
  // Captura datos de nodo desde cualquier ID
  transacciones: any[] | undefined;
  productos: any[] = [];
  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;

  // Variables para buscador
  campoBusqueda = new FormControl('');

  constructor(
    private productosUsuarioService: ProductosUsuarioService,
  ) { }

  ngOnInit(): void {
  }

}