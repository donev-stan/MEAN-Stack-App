import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private base_url: string = 'http://localhost:3000/api/user';
  private token: string | null = null;
  private authStatusListener = new BehaviorSubject<boolean>(false);
  private tokenTimer!: any;
  private userId!: string | null;

  constructor(private http: HttpClient, private router: Router) {}

  getToken(): string | null {
    return this.token;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  getUserId(): string | null {
    return this.userId;
  }

  autoAuthUser() {
    const authData = this.getAuthData()!;

    if (!authData) return;

    const expiresIn = authData.expirationDate.getTime() - new Date().getTime();

    if (expiresIn > 0) {
      this.token = authData.token;
      this.userId = authData.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    } else {
      this.logout();
    }
  }

  signup(email: string, password: string) {
    const authData: AuthData = { email, password };
    const url = this.base_url.concat('/signup');
    this.http
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        userId: string;
      }>(url, authData)
      .subscribe({
        next: ({ message, token, expiresIn, userId }) => {
          console.log(message);
          this.setCredentials(token, expiresIn, userId);
        },
        error: () => this.authStatusListener.next(false),
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };

    const url = this.base_url.concat('/login');

    this.http
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        userId: string;
      }>(url, authData, {
        withCredentials: true,
      })
      .subscribe({
        next: ({ message, token, expiresIn, userId }) => {
          console.log(message);
          this.setCredentials(token, expiresIn, userId);
        },
        error: () => this.authStatusListener.next(false),
      });
  }

  logout() {
    const url = this.base_url.concat('/logout');
    this.http
      .delete<{ message: string }>(url, { withCredentials: true })
      .subscribe({
        next: ({ message }) => {
          console.log(message);
          this.clearCredentials();
        },
      });
  }

  private setCredentials(token: string, expiresIn: number, userId: string) {
    if (!token) return;

    this.token = token;
    this.userId = userId;

    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    this.setAuthTimer(expiresIn);

    this.saveAuthData(this.token, expirationDate, this.userId);

    this.authStatusListener.next(true);
    this.router.navigate(['/posts']);
  }

  private clearCredentials() {
    this.token = null;
    this.userId = null;
    this.authStatusListener.next(false);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/auth/login']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    const authData = {
      token,
      expirationDate: expirationDate.toISOString(),
      userId,
    };

    localStorage.setItem('auth', JSON.stringify(authData));
  }

  private clearAuthData() {
    localStorage.removeItem('auth');
  }

  private getAuthData() {
    const authData = JSON.parse(localStorage.getItem('auth')!);

    if (!authData) return;

    return {
      token: authData.token,
      expirationDate: new Date(authData.expirationDate),
      userId: authData.userId,
    };
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
