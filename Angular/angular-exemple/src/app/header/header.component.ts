import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  checkLoginStatus(): boolean {
    return (this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true');
  }

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    this.isLoggedIn = false;

    this.router.navigate(['']);
  }
}
