import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decodeQuestion'
})
export class DecodeQuestionPipe implements PipeTransform {

  transform(question: string): string | null {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = question;

    return textarea.value;
  }

}
