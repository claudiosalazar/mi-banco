import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pesos'
})
export class PesosPipe implements PipeTransform {

  transform(value: any): string {
    if (!value) {
      return '';
    }
    // Quita cualquier signo de '$' existente, cualquier espacio después y los puntos
    const cleanValue = value.toString().replace(/\$\s*/g, '').replace(/\./g, '');
    // Convierte a número
    let numberValue = Number(cleanValue);
    // Verifica si el valor es un número válido
    if (isNaN(numberValue)) {
      return value;
    }
    // Formatea el número con separadores de miles
    let formattedValue = numberValue.toLocaleString('es-CL');
    // Reemplaza las comas por puntos
    formattedValue = formattedValue.replace(/,/g, '.');
    // Agrega el signo de '$' al inicio
    formattedValue = '$ ' + formattedValue;
    return formattedValue;
  }

}