import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numeroTarjeta'
})
export class NumeroTarjetaPipe implements PipeTransform {

  transform(value: any): string {
    if (!value) {
      return '';
    }
    if (typeof value === 'string') {
      return value.replace(/\d(?=(?:\D*\d){4})/g, "*");
    }
    return value;
  }

}