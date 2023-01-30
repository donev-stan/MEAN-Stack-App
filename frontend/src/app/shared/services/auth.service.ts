import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from '../models/auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private base_url: string = 'http://localhost:3000/api/user';
  private token: string = '';

  constructor(private http: HttpClient) {}

  getToken(): string {
    return this.token;
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
    });
  }
}
