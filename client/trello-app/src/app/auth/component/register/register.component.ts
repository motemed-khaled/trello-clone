import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/shared/service/socket.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string | null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private socketService:SocketService
  ) {
    this.errorMessage = null;
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.authService.register(this.registerForm.value).subscribe({
      next: (curentUser) => {
        this.authService.setToken(curentUser);
        this.socketService.setUpSocketConnection(localStorage.getItem("token")!);
        this.authService.setCurrentUser(curentUser);
        this.router.navigate(['']);
      },
      error: (err: HttpErrorResponse) => {
        console.log('err' + err.error.errors[0].msg);
        this.errorMessage = err.error.errors[0].msg;
      },
    });
  }
}
