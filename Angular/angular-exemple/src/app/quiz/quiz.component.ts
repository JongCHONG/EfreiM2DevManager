import { Component, OnInit } from '@angular/core';
import { QuizService } from '../services/quiz.service';

interface Question {
  question: string;
  options: string[];
  correctAnswers: string[];
  isMultiple: boolean;
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  username: string = '';

  constructor(
    private quizService: QuizService,
  ) {}

  quiz: Question[] = this.quizService.quiz;

  score: number | undefined;

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
  }

  get userAnswers() {
    return this.quizService.userAnswers;
  }

  selectAnswer(
    questionIndex: number,
    answer: string,
    isMultiple: boolean
  ): void {
    this.quizService.selectAnswer(questionIndex, answer, isMultiple);
  }

  onAnswerSelected(event: {
    questionIndex: number;
    answer: string;
    isMultiple: boolean;
  }) {
    this.quizService.selectAnswer(
      event.questionIndex,
      event.answer,
      event.isMultiple
    );
  }

  calculateScore(): number {
    const score = this.quizService.calculateScore(this.quiz);
    this.quizService.navigateToScore(score);
    return score;
  }
}
