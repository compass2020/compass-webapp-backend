import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metersPipe',
})
export class MetersPipePipe implements PipeTransform {
  transform(length: number): string {
    let output;
    if (!isNaN(length)) {
      if (length > 1000) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
      } else {
        output = Math.round(length) + ' ' + 'm';
      }
      return output;
    } else return '0 m';
  }
}
