import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeElapsed'
})
export class TimeElapsedPipe implements PipeTransform {
  transform(startTime: Date, endTime: Date): string {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const elapsed = end - start;

    const seconds = Math.floor((elapsed / 1000) % 60);
    const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
    const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);

    return `${hours}h ${minutes}m ${seconds}s`;
  }
}