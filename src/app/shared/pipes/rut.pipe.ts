import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rut'
})
export class RutPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) {
      return '';
    }

    // Convertimos el valor a una cadena
    let strValue = value.toString();

    // Agregamos el carácter '-' antes del último carácter
    strValue = strValue.slice(0, -1) + '-' + strValue.slice(-1);

    // Separamos los caracteres anteriores al '-' por separadores de miles
    const parts = strValue.split('-');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return parts.join('-');
  }

}