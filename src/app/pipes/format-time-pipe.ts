import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {
  transform(time: number): string {
    return new Date(time).toLocaleTimeString();
  }
}
