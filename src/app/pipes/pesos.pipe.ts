import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pesos'
})
export class PesosPipe implements PipeTransform {

  /* transform(value: number): string | null {
    if (value !== undefined && value !== null) {
      return this.formatNumber(value);
    } else {
      return null;
    }
  }

  private formatNumber(value: number): string {
    return '$ ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  } */

  transform(value: any): string | null {
    if (value !== undefined && value !== null) {
      // Si el valor ya empieza con un signo de dólar, simplemente devolvemos el valor sin cambios
      if (typeof value === 'string' && value.trim().startsWith('$')) {
        return value;
      } else {
        // Si el valor no empieza con un signo de dólar, añadimos uno
        return this.formatNumber(value);
      }
    } else {
      return null;
    }
  }

  private formatNumber(value: number): string {
    return '$ ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

}
