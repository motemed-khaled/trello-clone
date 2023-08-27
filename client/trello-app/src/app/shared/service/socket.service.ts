import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { CurentUser } from 'src/app/auth/types/curent-user';
import { environments } from 'src/environments/environments';
import { ColumRequest } from '../types/colum-request';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: Socket | undefined;
  constructor() { }

  setUpSocketConnection(currentUser: string): void {
    this.socket = io(environments.socketUrl, {
      auth: {
        token: `Bearer ${currentUser}`
      },
    });
  }

  disConnect(): void {
    if (!this.socket) {
      throw new Error("socket connection is not established");
    }
    this.socket.disconnect();
  }

  emit(eventName: string, message: any): void {
    if (!this.socket) {
      throw new Error("socket connection is not established");
    }
    this.socket.emit(eventName, message);
  }

  listen<T>(eventName: string): Observable<T> {
    const socket = this.socket;
    if (!socket) {
      throw new Error("socket connection is not established");
    }
    return new Observable((Subscriber) => {
      socket.on(eventName, (data) => {
        Subscriber.next(data);
      });
    });
  }
}
