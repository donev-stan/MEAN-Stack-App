import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthData } from '../models/auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private base_url: string = 'http://localhost:3000/api/user';
  private token: string | null = null;
  private authStatusListener = new BehaviorSubject<boolean>(false);
  private tokenTimer!: any;

  constructor(private http: HttpClient, private router: Router) {}

  getToken(): string | null {
    return this.token;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  signup(email: string, password: string) {
    const authData: AuthData = { email, password };

    const url = this.base_url.concat('/signup');

    this.http.post(url, authData).subscribe(console.log);
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };

    const url = this.base_url.concat('/login');

    this.http.post(url, authData).subscribe((response: any) => {
      this.token = response.token;

      if (this.token) {
        const expiresInDuration: number = response.expiresIn;

        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, expiresInDuration * 1000);

        this.authStatusListener.next(true);
        this.router.navigate(['/list-post']);
      }
    });
  }

  logout() {
    this.token = null;
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
    clearTimeout(this.tokenTimer);
  }
}
