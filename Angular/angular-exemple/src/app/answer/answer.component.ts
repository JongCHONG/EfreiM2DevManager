import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss'],
})
export class AnswerComponent {
  @Input() options: string[] = [];
  @Input() questionIndex: number = 0;
  @Input() isMultiple: boolean = false;
  @Input() userAnswers: string[] = [];

  @Output() answerSelected = new EventEmitter<{
    questionIndex: number;
    answer: string;
    isMultiple: boolean;
  }>();

  onAnswerChange(answer: string) {
    this.answerSelected.emit({
      questionIndex: this.questionIndex,
      answer,
      isMultiple: this.isMultiple,
    });
  }
}