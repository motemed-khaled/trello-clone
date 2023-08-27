import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { SocketService } from './shared/service/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService , private socketService:SocketService) {}

  ngOnInit(): void {
    console.log(true)
    this.authService.getCurrentUser().subscribe({
      next: (curentUser) => {
        this.authService.setCurrentUser(curentUser);
        console.log(curentUser)
        this.socketService.setUpSocketConnection(localStorage.getItem("token")!);
      },
      error: (err) => {
        this.authService.setCurrentUser(null);
      },
    });
  }
}
