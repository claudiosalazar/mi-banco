import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'celular'
})
export class CelularPipe implements PipeTransform {

  transform(value: any): string {
    if (typeof value !== 'string') {
      value = String(value);
    }

    // Asegúrate de que el valor sea una cadena antes de llamar a replace
    return value.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }

}