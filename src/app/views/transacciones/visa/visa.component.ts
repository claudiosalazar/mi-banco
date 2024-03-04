import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms'
// Productos usuario
import { ProductosUsuarioService } from '../../../core/services/productos-usuario.service';
@Component({
  selector: 'app-visa',
  templateUrl: './visa.component.html'
})
export class VisaComponent implements OnInit {
   
  transaccionesVisa = '2';
  
  // Captura datos de nodo desde cualquier ID
  transacciones: any[] | undefined;
  productos: any[] = [];
  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;

  // Variables para productos
  productosUsuario: { productos: any[] } = { productos: [] };
  fechaUltimoAbono: any;
  ultimoMontoAbono: any;

  // Variables para buscador
  campoBusqueda = new FormControl('');
  mostrarPaginador: boolean|undefined;

  constructor(
    private productosUsuarioService: ProductosUsuarioService
  ) { }

  ngOnInit(): void {
    this.getProductosUsuarioResumen('');
  }

  getProductosUsuarioResumen(id: string): void {
    this.productosUsuarioService.getProductosUsuarioResumen(id).subscribe(data => {
      this.productosUsuario = data.productos ? { productos: data.productos } : { productos: [] };
      
      const transacciones = this.productosUsuario.productos[2]?.transacciones;
      let ultimaTransaccionConAbono;
  
      if (transacciones) {
        for (let i = transacciones.length - 1; i >= 0; i--) {
          if (transacciones[i].abono > 0) {
            ultimaTransaccionConAbono = transacciones[i];
            break;
          }
        }
      }
  
      if (ultimaTransaccionConAbono) {
        this.fechaUltimoAbono = ultimaTransaccionConAbono.fecha;
        this.ultimoMontoAbono = ultimaTransaccionConAbono.abono;
      }
    });
  }

  handleDatosFiltrados(datosFiltrados: any[]) {
    // Haz algo con los datos filtrados
    this.transacciones = datosFiltrados;
    this.productos = [...this.transacciones];
    this.originalData = [...this.transacciones];
    this.totalPages = Math.ceil(this.transacciones.length / this.itemsPerPage);
    // Aquí puedes agregar más lógica para manejar los datos filtrados si es necesario
  }
}
