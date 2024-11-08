import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private router: Router) {}

  addUser(user: any): Observable<any> {
    this.router.navigate(['']);
    return this.http.post<any>(this.apiUrl, user);
  }
  
  checkUser(username: string, password: string): Observable<boolean> {
    return this.http
      .get<{ username: string; password: string }[]>(this.apiUrl)
      .pipe(
        map((users: { username: string; password: string }[]) => {
          const user = users.find(
            (u: { username: string; password: string }) =>
              u.username === username && u.password === password
          );
          return !!user;
        })
      );
  }

  getUserById(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?username=${username}`);
  }
}
