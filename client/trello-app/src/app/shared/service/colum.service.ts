import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Colum } from '../types/colum';
import { environments } from 'src/environments/environments';
import { ColumRequest } from '../types/colum-request';
import { SocketService } from './socket.service';
import { SocketEventEnum } from '../types/socket.enum';

@Injectable({
  providedIn: 'root'
})
export class ColumService {

  constructor(private http:HttpClient , private socketService:SocketService) { }

  getColums(boardId:string): Observable<Colum[]>{
    const url = `${environments.apiUrl}/boards/${boardId}/colums`;
    return this.http.get<Colum[]>(url);
  }

  createColum(colum: ColumRequest): void{
    this.socketService.emit(SocketEventEnum.columsCreate, colum);
  }

  deleteColum(boardId: string, columId: string): void{
    this.socketService.emit(SocketEventEnum.columsDelete, { boardId, columId });
  }

  updateColum(boardId: string, columId: string, fields: { title: string }): void{
    this.socketService.emit(SocketEventEnum.columsUpdate, { boardId, columId, fields });
  }
}
