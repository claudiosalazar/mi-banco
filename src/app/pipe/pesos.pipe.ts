import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pesos'
})
export class PesosPipe implements PipeTransform {

  transform(value: number): string | null {
    if (value !== undefined && value !== null) {
      return this.formatNumber(value);
    } else {
      return null;
    }
  }

  private formatNumber(value: number): string {
    return '$ ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

}
