import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoggedSubscribtion:Subscription|undefined
  constructor(private authService: AuthService , private router:Router) { }

  ngOnInit(): void {
    this.isLoggedSubscribtion=this.authService.isLoggedIn.subscribe({
      next: (isLogged) => {
        if (isLogged) {
          this.router.navigateByUrl("/boards");
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.isLoggedSubscribtion?.unsubscribe();
  }

}
