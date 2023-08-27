import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/shared/service/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage: string | null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private socketService:SocketService
  ) {
    this.errorMessage = null;
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (curentUser) => {
        this.errorMessage = null;
        this.authService.setToken(curentUser);
        this.socketService.setUpSocketConnection(localStorage.getItem("token")!);
        this.authService.setCurrentUser(curentUser);
        this.router.navigate(['']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.error.errors) {
          console.log(true);
          this.errorMessage = err.error.errors[0].msg;
        } else {
          this.errorMessage = err.error.message;
        }
      },
    });
  }
}
