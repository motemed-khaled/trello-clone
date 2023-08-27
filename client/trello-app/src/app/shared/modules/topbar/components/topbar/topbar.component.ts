import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {

  constructor(private authService:AuthService , private router:Router){}

  logOut(): void{
    this.authService.logOut();
    this.router.navigateByUrl("/");
  }
}
