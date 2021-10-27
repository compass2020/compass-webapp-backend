import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteSeconds',
})
export class MinuteSecondsPipe implements PipeTransform {
  transform(value: number): string {
    const minutes = Math.floor(value);
    const seconds = '0' + Math.floor((value - minutes) * 60); // add leading zero

    return minutes + ':' + seconds.substr(seconds.length - 2) + ' min/km';
  }
}
