import { Component, OnInit } from '@angular/core';
import { HistorialTransaccionesService } from '../../../services/historial-transacciones.service';
import { HistorialTransacciones } from '../../../../assets/models/historial-transacciones.model';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html'
})

export class TransaccionesComponent implements OnInit {
  data: HistorialTransacciones[] = [];
  displayedData: HistorialTransacciones[] = [];
  sortColumn = '';
  sortAscending = true;
  pageSize = 5;
  currentPage = 1;

  constructor(private historialTransaccionesService: HistorialTransaccionesService) { }

  ngOnInit() {
    this.historialTransaccionesService.getTransacciones().subscribe(transacciones => {
      this.data = transacciones;
      this.updateDisplayedData();
    });
  }

  updateDisplayedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedData = this.data.slice(start, end);
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
    this.updateDisplayedData();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updateDisplayedData();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedData();
    }
  }
  
  nextPage() {
    if (this.currentPage < Math.ceil(this.data.length / this.pageSize)) {
      this.currentPage++;
      this.updateDisplayedData();
    }
  }
}