interface Producto {
   id: string;
   transacciones: any[];
}
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms'
import { ProductosUsuarioService } from 'src/app/core/services/productos-usuario.service';
import { ProductosUsuario } from 'src/app/shared/models/productos-usuario.model';

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html'
})
export class CuentaCorrienteComponent implements OnInit {
  
  
  transacciones: any[] | undefined;
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;

  // Variables para buscador
  campoBusqueda = new FormControl('');
  productos: any[] = [];
  originalData: any[] = [];

  // Variables para ordenar datos de tabla
  sortOrder = 1;
  sortedColumn = '';
  sortAscending: boolean = true;

  // Variable para animacion de icono en th
  public isRotatedIn: boolean = false;


  public columnaSeleccionada: string = '';

  constructor(
    private productosUsuarioService: ProductosUsuarioService,
    private http: HttpClient
  ) { }

  

  ngOnInit(): void {
    const id = '0'; // Reemplaza '0' con el ID que deseas obtener
    this.productosUsuarioService.getProductosUsuarioTable().subscribe((productosUsuario: ProductosUsuario) => {
      const productos = productosUsuario.productos;
      const producto = productos.find(producto => producto.id === id);
      if (producto) {
        // Imprime los datos en la tabla, solo los primeros 5
        this.transacciones = producto.transacciones;
        this.productos = [...this.transacciones];
        this.originalData = [...this.transacciones];

        // Asigna el valor de 'cupo' al saldo del ID 0 de las transacciones
if (this.transacciones.length > 0) {
  this.transacciones[0].saldo = parseFloat(producto.cupo) - parseFloat(this.transacciones[0].cargo);
}

// Realiza el cálculo para los demás IDs
for (let i = 1; i < this.transacciones.length; i++) {
  if (parseFloat(this.transacciones[i].cargo) > 0) {
    this.transacciones[i].saldo = parseFloat(this.transacciones[i - 1].saldo) - parseFloat(this.transacciones[i].cargo);
  }
  if (parseFloat(this.transacciones[i].abono) > 0) {
    this.transacciones[i].saldo = parseFloat(this.transacciones[i - 1].saldo) + parseFloat(this.transacciones[i].abono);
  }
}



        this.transacciones.sort((a, b) => {
          const dateA = new Date(a.fecha);
          const dateB = new Date(b.fecha);
          return dateB.getTime() - dateA.getTime();
        });
        this.totalPages = Math.ceil(this.transacciones.length / this.itemsPerPage);
        this.paginacionDatos();
        this.campoBusqueda.valueChanges.subscribe(valorBusqueda => {
          if (valorBusqueda) {
            this.transacciones = this.originalData.filter(transaccion =>
              Object.values(transaccion).some(val =>
              val?.toString().toLowerCase().includes(valorBusqueda.toLowerCase())
              )
            );
          } else {
            this.transacciones = [...this.originalData];
          }
          this.paginacionDatos();
        });
      } else {
        console.error('ID no encontrado');
      }
    }, error => {
      console.error('Error al obtener los datos del producto:', error);
    });
  }

  public onHeaderClick(): void {
    this.isRotatedIn = !this.isRotatedIn;
  }

  // Ordena los datos de la tabla
  ordenarDatos(column: string): void {
    this.columnaSeleccionada = column;
    if (this.sortedColumn === column) {
      this.sortOrder = this.sortOrder === 1 ? -1 : 1;
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortedColumn = column;
      this.sortAscending = true;
    }
  
    this.sortOrder = this.sortAscending ? 1 : -1;
  
    this.transacciones?.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
      return a[column] > b[column] ? this.sortOrder : a[column] < b[column] ? -this.sortOrder : 0;
    });
    this.paginacionDatos();
  }

  // Functions para paginados
  paginacionDatos(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;
    this.paginatedData = this.transacciones ? this.transacciones.slice(startIndex, endIndex) : [];
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginacionDatos();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginacionDatos();
    }
  }
  
  seleccionarPagina(page: number): void {
    this.currentPage = page;
    this.paginacionDatos();
  }
  
}