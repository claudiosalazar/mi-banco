import { Component, OnInit } from '@angular/core';
import { HistorialTransaccionesService } from '../../../services/historial-transacciones.service';
import { HistorialTransacciones } from '../../../../assets/models/historial-transacciones.model';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html'
})

export class TransaccionesComponent implements OnInit {
  data: HistorialTransacciones[] = [];
  sortColumn = '';
  sortAscending = true;

  constructor(private historialTransaccionesService: HistorialTransaccionesService) { }

  ngOnInit() {
    this.historialTransaccionesService.getTransacciones().subscribe(transacciones => {
      this.data = transacciones;
    });
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }

    this.data.sort((a, b) => {
      if (a[this.sortColumn as keyof HistorialTransacciones] < b[this.sortColumn as keyof HistorialTransacciones]) {
        return this.sortAscending ? -1 : 1;
      } else if (a[this.sortColumn as keyof HistorialTransacciones] > b[this.sortColumn as keyof HistorialTransacciones]) {
        return this.sortAscending ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}