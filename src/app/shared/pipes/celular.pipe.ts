import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'celular'
})
export class CelularPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) return value;

    // Insertar espacios en los lugares correctos
    const newValue = value.replace(/(\d{1})(\d{4})(\d{4})/, '$1 $2 $3');

    return newValue;
  }

}