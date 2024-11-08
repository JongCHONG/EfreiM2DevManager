import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface Question {
  question: string;
  options: string[];
  correctAnswers: string[];
  isMultiple: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = 'http://localhost:3000/quiz';

  quiz: Question[] = [];
  score: number | undefined;

  userAnswers: { [key: number]: string[] } = {};

  constructor(private router: Router, private http: HttpClient) {
    this.getQuiz();
  }

  getQuiz() {
    this.http.get<Question[]>(this.apiUrl).subscribe((data) => {
      this.quiz = data;
    });
  }

  selectAnswer(
    questionIndex: number,
    answer: string,
    isMultiple: boolean
  ): void {
    if (!this.userAnswers[questionIndex]) {
      this.userAnswers[questionIndex] = [];
    }
    if (isMultiple) {
      if (this.userAnswers[questionIndex].includes(answer)) {
        this.userAnswers[questionIndex] = this.userAnswers[
          questionIndex
        ].filter((a) => a !== answer);
      } else {
        this.userAnswers[questionIndex].push(answer);
      }
    } else {
      this.userAnswers[questionIndex] = [answer];
    }
  }

  calculateScore(quiz: any[]): number {
    let score = 0;
    quiz.forEach((question, index) => {
      const userAnswer = this.userAnswers[index] || [];
      if (
        JSON.stringify(userAnswer.sort()) ===
        JSON.stringify(question.correctAnswers.sort())
      ) {
        score++;
      }
    });
    return score;
  }

  navigateToScore(score: number): void {
    this.router.navigate(['/score', score]);
  }
}
