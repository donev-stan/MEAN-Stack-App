import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) return;

    this.isLoading = true;

    this.authService.login(loginForm.value.email, loginForm.value.password);
  }
}
