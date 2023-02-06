import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
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

  onSignup(formData: NgForm) {
    if (formData.invalid) return;

    this.isLoading = true;
    this.authService.signup(formData.value.email, formData.value.password);
  }
}
