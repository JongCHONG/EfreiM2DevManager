import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private userService: UserService) {}

  startQuiz() {
    this.userService.checkUser(this.username, this.password).subscribe(
      userChecked => {
        if (userChecked) {
          localStorage.setItem('username', this.username);
          localStorage.setItem('isLoggedIn', 'true');
          
          this.router.navigate(['/quiz']);
        } else {
          console.log('User not found');
        }
      },
      error => {
        console.error('Error checking user', error);
      }
    );
  }
}
