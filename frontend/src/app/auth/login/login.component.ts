import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  private authStatusSubscription!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus: boolean) => {
        this.isLoading = authStatus;
      });
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) return;

    this.isLoading = true;

    this.authService.login(loginForm.value.email, loginForm.value.password);
  }
}
