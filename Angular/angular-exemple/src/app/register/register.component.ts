import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { UserService } from '../services/user.service';
import { PasswordMatchValidator } from '../validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private userService: UserService) {
    this.registerForm = new FormGroup(
      {
        username: new FormControl('', [Validators.required, Validators.minLength(3)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      { validators: [PasswordMatchValidator('password', 'confirmPassword') as ValidatorFn] }
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.userService.addUser(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('User added successfully', response);
        },
        error: (error) => {
          console.error('Error adding user', error);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
}