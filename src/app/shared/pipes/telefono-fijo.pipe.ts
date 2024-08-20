import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefonoFijo'
})
export class TelefonoFijoPipe implements PipeTransform {

  transform(value: string): string {
    if (typeof value !== 'string') {
      value = String(value);
    }

    // Insertar un espacio después del segundo y quinto dígito
    return value.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
  }

}