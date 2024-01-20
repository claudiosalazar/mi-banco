import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rangos'
})
export class RangosPipe implements PipeTransform {
  transform(value: number): number[] {
    return Array.from({length: Math.ceil(value)}, (v, k) => k + 1);
  }
}