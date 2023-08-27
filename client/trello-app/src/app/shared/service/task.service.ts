import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';
import { SocketService } from './socket.service';
import { Task } from '../types/task';
import { SocketEventEnum } from '../types/socket.enum';
import { TaskRequest } from '../types/task-request';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http:HttpClient , private socketService:SocketService) { }

  gettasks(boardId:string): Observable<Task[]>{
    const url = `${environments.apiUrl}/boards/${boardId}/task`;
    return this.http.get<Task[]>(url);
  }

  createTask(task:TaskRequest):void {
    this.socketService.emit(SocketEventEnum.taskCreate, task);
  }

  updateTask(boardId: string, taskId: string, fields: { title?: string, description?: string , columId?:string}): void{
    this.socketService.emit(SocketEventEnum.taskUpdate, { boardId, taskId, fields });
  }

  deleteTask(boardId:string , taskId:string):void{
    this.socketService.emit(SocketEventEnum.taskDelete, { boardId, taskId });
  }

}
