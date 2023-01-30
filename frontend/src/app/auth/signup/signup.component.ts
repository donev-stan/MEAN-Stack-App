import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onSignup(formData: NgForm) {
    if (formData.invalid) return;

    this.isLoading = true;

    this.authService.signup(formData.value.email, formData.value.password);
  }
}
