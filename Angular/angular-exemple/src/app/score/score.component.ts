import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
  score: number | undefined;


  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.score = +this.route.snapshot.paramMap.get('score')!;
  }

  restart(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      this.router.navigate(['/quiz']);
    } else {
      this.router.navigate(['']);
    }
  }
}
