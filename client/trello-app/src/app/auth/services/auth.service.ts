import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurentUser } from '../types/curent-user';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { environments } from 'src/environments/environments';
import { RegisterRequest } from '../types/register-request';
import { LoginRequest } from '../types/login-request';
import { SocketService } from 'src/app/shared/service/socket.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = new BehaviorSubject<CurentUser | null | undefined>(undefined);
  isLoggedIn = this.currentUser.pipe(filter(currentUser => currentUser !== undefined)
    , map(Boolean))
  constructor(private http: HttpClient , private socketService:SocketService) {}

  getCurrentUser(): Observable<CurentUser> {
    return this.http.get<CurentUser>(`${environments.apiUrl}/user`);
  }

  setCurrentUser(currentUser: CurentUser | null): void {
    this.currentUser.next(currentUser);
  }

  register(user: RegisterRequest): Observable<CurentUser> {
    const url = `${environments.apiUrl}/user/register`;
    return this.http.post<CurentUser>(url, user);
  }

  login(user: LoginRequest): Observable<CurentUser> {
    const url = `${environments.apiUrl}/user/login`;
    return this.http.post<CurentUser>(url, user);
  }

  logOut():void {
    localStorage.removeItem("token");
    this.currentUser.next(null);
    this.socketService.disConnect();
  }

  setToken(curentUser: CurentUser): void {
    localStorage.setItem('token', curentUser.token!);
  }
}
