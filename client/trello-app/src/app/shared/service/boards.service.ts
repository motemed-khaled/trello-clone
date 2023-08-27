import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Board } from '../types/board';
import { environments } from 'src/environments/environments';
import { SocketService } from './socket.service';
import { SocketEventEnum } from '../types/socket.enum';

@Injectable({
  providedIn: 'root'
})
export class BoardsService {

  constructor(private http: HttpClient , private socketService:SocketService) { }

  getBoards(): Observable<Board[]>{
    const url = `${environments.apiUrl}/boards`;
    return this.http.get<Board[]>(url);
  }

  createBoard(title: string): Observable<Board>{
    const url = `${environments.apiUrl}/boards`;
    return this.http.post<Board>(url, { title });
  }

  getBoard(boardId: string): Observable<Board>{
    const url = `${environments.apiUrl}/boards/${boardId}`;
    return this.http.get<Board>(url);
  }

  updateBoard(boardId: string, fields: { title: string }): void{
    this.socketService.emit(SocketEventEnum.boardsUpdate, { boardId, fields });
  }

  deleteBoard(boardId: string): void{
    this.socketService.emit(SocketEventEnum.boardsDelete, { boardId });
  }
}
